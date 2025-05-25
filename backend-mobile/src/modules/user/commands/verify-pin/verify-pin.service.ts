import { Injectable } from "@nestjs/common";
import { Result, Ok, Err } from "oxide.ts";
import * as bcrypt from 'bcrypt';
import { addMinutes } from 'date-fns';

import { VerifyPinUserCommand } from "./verify-pin.command";
import { UserRepositoryImpl } from "../../repositories/user.repository.impl";
import { Email } from "../../domain/value-objects/user/email.vo";
import { PrismaService } from "src/infrastructure/database/prisma/prisma.service";

@Injectable()
export class VerifyPinUserService {
  constructor(
    private readonly userRepository: UserRepositoryImpl,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    command: VerifyPinUserCommand,
  ): Promise<Result<{ isValid: boolean, remainingAttempts?: number, lockedUntil?: Date }, Error>> {
    try {
      const emailResult = Email.create(command.email);
      if (emailResult.isErr()) {
        return Err(new Error('Invalid email format'));
      }
      
      const user = await this.userRepository.findByEmail(emailResult.unwrap());
      
      if (!user) {
        return Err(new Error('User not found'));
      }
      
      const pinStatus = await this.userRepository.findPinStatusByEmail(emailResult.unwrap());
      
      if (!pinStatus) {
        return Err(new Error('PIN has not been set up for this user'));
      }
      
      // Check if account is locked
      if (pinStatus.lockedUntil && pinStatus.lockedUntil > new Date()) {
        return Ok({ 
          isValid: false, 
          lockedUntil: pinStatus.lockedUntil 
        });
      }
      
      // Verify PIN
      const isPinValid = await bcrypt.compare(command.pin, pinStatus.hashedPin);
      
      if (isPinValid) {
        // Reset attempts on successful verification
        await this.prisma.userPin.update({
          where: { userEmail: command.email },
          data: {
            attempts: 0,
            lockedUntil: null
          }
        });
        
        return Ok({ isValid: true });
      } else {
        // Increment attempts and potentially lock account
        const MAX_ATTEMPTS = 5;
        const newAttempts = pinStatus.attempts + 1;
        let lockedUntil = null;
        
        if (newAttempts >= MAX_ATTEMPTS) {
          // Lock account for 30 minutes after max attempts
          lockedUntil = addMinutes(new Date(), 30);
        }
        
        await this.prisma.userPin.update({
          where: { userEmail: command.email },
          data: {
            attempts: newAttempts >= MAX_ATTEMPTS ? 0 : newAttempts,
            lockedUntil: lockedUntil
          }
        });
        
        return Ok({ 
          isValid: false, 
          remainingAttempts: MAX_ATTEMPTS - newAttempts,
          lockedUntil: lockedUntil
        });
      }
    } catch (error) {
      return Err(new Error(`Failed to verify PIN: ${error.message}`));
    }
  }
}