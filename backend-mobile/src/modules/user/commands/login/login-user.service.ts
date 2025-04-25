import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Result, Ok, Err } from "oxide.ts";
import { ConfigService } from "@nestjs/config";

import { LoginUserCommand } from "./login-user.command";
import { Email } from "../../domain/value-objects/user/email.vo";
import { UserRepositoryImpl } from "../../repositories/user.repository.impl";
import { USER_MESSAGES } from "src/shared/constants/constants";
import { LoginResponseData } from "./login-user-response.dto";

@Injectable()
export class LoginUserService {
  constructor(
    private readonly userRepository: UserRepositoryImpl,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(
    command: LoginUserCommand,
  ): Promise<Result<LoginResponseData, Error>> {
    const emailOrError = Email.create(command.email);
    if (emailOrError.isErr()) {
      return Err(emailOrError.unwrapErr());
    }

    const email = emailOrError.unwrap();
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return Err(new Error(USER_MESSAGES.ERRORS.LOGIN_FAILED));
    }

    const passwordMatches = await user.password.comparePassword(command.password);
    if (!passwordMatches) {
      return Err(new Error(USER_MESSAGES.ERRORS.LOGIN_FAILED));
    }

    const payload = {
      email: user.email.value,
      role: user.role.getValue()
    };
    const access_token = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    })

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.userRepository.saveRefreshToken(refreshToken, user.email.value, expiresAt);

    return Ok({ access_token, refresh_token: refreshToken });
  }
}