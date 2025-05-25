import { Injectable } from "@nestjs/common";
import { UserRepositoryImpl } from "../../repositories/user.repository.impl";
import { Email } from "../../domain/value-objects/user/email.vo";
import { Result, Ok, Err } from "oxide.ts";
import { UserPinStatusData } from "./get-pin-status.response.dto";

@Injectable()
export class GetUserPinStatusService {
  constructor(
    private readonly userRepository: UserRepositoryImpl
  ) {}

  async execute(email: string): Promise<Result<UserPinStatusData, Error>> {
    const emailOrError = Email.create(email);
    if (emailOrError.isErr()) {
      return Err(emailOrError.unwrapErr());
    }
    
    const pinStatus = await this.userRepository.findPinStatusByEmail(emailOrError.unwrap());
    
    if (pinStatus != null) {
      const remainingAttempts = 5 - pinStatus.attempts ;
      return Ok({
        requiresPinVerification: true,
        remainingAttempts: remainingAttempts,
        lockedUntil: pinStatus.lockedUntil,
      });
    } 

    return Ok({
      requiresPinSetup: true,
    })
  }
}