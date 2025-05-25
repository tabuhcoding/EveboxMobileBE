import { Injectable } from "@nestjs/common";
import { Result, Ok, Err } from "oxide.ts";
import * as bcrypt from 'bcrypt';

import { CreatePinUserCommand } from "./create-pin.command";
import { UserRepositoryImpl } from "../../repositories/user.repository.impl";
import { Email } from "../../domain/value-objects/user/email.vo";

@Injectable()
export class CreatePinUserService {
  constructor(
    private readonly userRepository: UserRepositoryImpl,
  ) {}

  async execute(
    command: CreatePinUserCommand,
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
      
      if (existingPin) {
        return Err(new Error('PIN already exists for this user'));
      }
      
      // Hash the PIN (using bcrypt with salt rounds of 10)
      const saltRounds = 10;
      const hashedPin = await bcrypt.hash(command.pin, saltRounds);
      
      // Create new PIN
      await this.userRepository.createPinUser(emailResult.unwrap(), hashedPin);
      
      return Ok(true);
    } catch (error) {
      return Err(new Error(`Failed to create PIN: ${error.message}`));
    }
  }
}