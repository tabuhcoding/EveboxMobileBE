import { Injectable } from "@nestjs/common";
import { Result, Ok, Err } from "oxide.ts";
import * as bcrypt from 'bcrypt';

import { ChangePinUserCommand } from "./change-pin.command";
import { UserRepositoryImpl } from "../../repositories/user.repository.impl";
import { Email } from "../../domain/value-objects/user/email.vo";
import { PrismaService } from "src/infrastructure/database/prisma/prisma.service";

@Injectable()
export class ChangePinUserService {
  constructor(
    private readonly userRepository: UserRepositoryImpl,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    command: ChangePinUserCommand,
  ): Promise<Result<Boolean, Error>> {
    try {
      const emailResult = Email.create(command.email);
      if (emailResult.isErr()) {
        return Err(new Error('Invalid email format'));
      }
      
      const user = await this.userRepository.findByEmail(emailResult.unwrap());
      
      if (!user) {
        return Err(new Error('User not found'));
      }
      
      const existingPin = await this.userRepository.findPinStatusByEmail(emailResult.unwrap());
      
      if (!existingPin) {
        return Err(new Error('PIN does not exist for this user'));
      }
      
      // Verify current PIN matches
      const isPinValid = await bcrypt.compare(command.pin, existingPin.hashedPin);
      if (!isPinValid) {
        return Err(new Error('Current PIN is incorrect'));
      }
      
      const saltRounds = 10;
      const hashedPin = await bcrypt.hash(command.pin, saltRounds);
      
      await this.userRepository.updatePinUser(emailResult.unwrap(), hashedPin);
      
      return Ok(true);
    } catch (error) {
      return Err(new Error(`Failed to change PIN: ${error.message}`));
    }
  }
}