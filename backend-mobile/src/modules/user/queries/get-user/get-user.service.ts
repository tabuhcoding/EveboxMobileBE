import { Injectable } from "@nestjs/common";
import { UserRepositoryImpl } from "../../repositories/user.repository.impl";
import { Email } from "../../domain/value-objects/user/email.vo";
import { Result, Ok, Err } from "oxide.ts";
import { UserData } from "./get-user-response.dto";

@Injectable()
export class GetUserService {
  constructor(
    private readonly userRepository: UserRepositoryImpl
  ) {}

  async execute(email: string): Promise<Result<UserData, Error>> {
    const emailOrError = Email.create(email);
    if (emailOrError.isErr()) {
      return Err(emailOrError.unwrapErr());
    }

    const user = await this.userRepository.findByEmail(emailOrError.unwrap());
    
    if (user != null) {
      return Ok({
        id: user.id.value, 
        name: user.name.value, 
        email: user.email.value,
        role: user.role.getValue(), 
        phone: user.phone.value,
      });
    }

    return Err(new Error("User not found"));
  }
}