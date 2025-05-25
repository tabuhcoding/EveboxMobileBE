import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService, ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { LoginUserController } from "./commands/login/login-user.controller";
import { LoginUserService } from "./commands/login/login-user.service"
import { JwtStrategy } from '../../shared/strategies/jwt.strategy';
import { UserRepositoryImpl } from './repositories/user.repository.impl';
import { LogoutUserController } from './commands/logout/logout-user.controller';
import { LogoutUserService } from './commands/logout/logout-user.service';
import { GetUserController } from './queries/get-user/get-user.controller';
import { GetUserService } from './queries/get-user/get-user.service';
import { GetUserPinStatusController } from "./queries/get-pin-status/get-pin-status.controller";
import { GetUserPinStatusService } from "./queries/get-pin-status/get-pin-status.service";
import { CreatePinUserService } from "./commands/create-pin/create-pin.service";
import { CreatePinUserController } from "./commands/create-pin/create-pin.controller";
import { ChangePinUserController } from "./commands/change-pin/change-pin.controller";
import { ChangePinUserService } from "./commands/change-pin/change-pin.service";
import { VerifyPinUserController } from "./commands/verify-pin/verify-pin.controller";
import { VerifyPinUserService } from "./commands/verify-pin/verify-pin.service";

@Module({
  imports: [
    ConfigModule,
    CqrsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    })
  ],
  controllers: [
    LoginUserController,
    LogoutUserController,
    GetUserController,
    GetUserPinStatusController,
    CreatePinUserController,
    ChangePinUserController,
    VerifyPinUserController,
  ],
  providers: [
    LoginUserService,
    LogoutUserService,
    UserRepositoryImpl,
    GetUserService,
    GetUserPinStatusService,
    CreatePinUserService,
    ChangePinUserService,
    VerifyPinUserService,
    JwtStrategy,
  ],
  exports: [UserRepositoryImpl],
})

export class UserModule {}