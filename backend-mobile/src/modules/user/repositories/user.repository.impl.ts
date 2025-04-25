import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { PrismaService } from "src/infrastructure/database/prisma/prisma.service";
import { User } from "../domain/entities/user.entity";
import { Email } from "../domain/value-objects/user/email.vo";
import { UserId } from "../domain/value-objects/user/user-id.vo";
import { Password } from "../domain/value-objects/user/password.vo";
import { Role } from "../domain/value-objects/user/role.vo";
import { Name } from '../domain/value-objects/user/name.vo';
import { Phone } from '../domain/value-objects/user/phone.vo';
import { ProvinceId } from '../domain/value-objects/user/province-id.vo';
import { EventBus } from '@nestjs/cqrs';
import { Prisma, RefreshToken } from '@prisma/client';
import { IOTPData } from './user.repository.interface';
import { OTPType } from '../domain/enums/otp-type.enum';
import { DomainEvent } from 'src/libs/ddd/domain-event.base';
import { OTP } from '../domain/entities/otp.entity';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBus
  ) { }

  async findByEmail(email: Email): Promise<User | null> {
    const userRecord = await this.prisma.user.findUnique({
      where: { email: email.value },
      include: {
        role: true,
        userProvince: {
          include: {
            province: true,
          },
        },
      },
    });

    if (!userRecord) {
      return null;
    }

    return this.mapToDomain(userRecord);
  }

  async save(user: User): Promise<void> {
    const userOrmData = this.mapToOrmData(user);
    await this.prisma.$transaction(async (tx) => {
      await tx.user.upsert({
        where: { id: userOrmData.id },
        update: {
          name: userOrmData.name,
          email: userOrmData.email,
          password: userOrmData.password,
          phone: userOrmData.phone,
          role_id: userOrmData.role,
        },
        create: {
          id: userOrmData.id,
          name: userOrmData.name,
          email: userOrmData.email,
          password: userOrmData.password,
          phone: userOrmData.phone,
          role_id: userOrmData.role,
        },
      });

      // Xử lý liên kết với Province thông qua bảng trung gian
      await tx.userProvince.deleteMany({
        where: { userId: userOrmData.id },
      });

      if (userOrmData.provinceIds.length > 0) {
        console.log('provinceIds:', userOrmData.provinceIds);
        await tx.userProvince.createMany({
          data: userOrmData.provinceIds.map((provinceId) => ({
            userId: userOrmData.id,
            provinceId: provinceId.value,
          })),
        });
      }
    });

    // Phát hành các sự kiện domain
    const domainEvents = user.getDomainEvents();
    for (const event of domainEvents) {
      await this.eventBus.publish(event);
    }
    user.clearDomainEvents();
  }

  async saveRefreshToken(
    token: string,
    email: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.prisma.refreshToken.create({
      data: {
        token,
        email,
        expiresAt,
      },
    });
  }

  async revokeAllRefreshTokens(email: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: {
        email: email,
        revoked: false
      },
      data: {
        revoked: true
      }
    })
  }

  private mapToDomain(
    userRecord: Prisma.UserGetPayload<{
      include: {
        role: true;
        userProvince: { include: { province: true } };
      };
    }>,
  ): User {
    const userIdOrError = UserId.create(userRecord.id);
    if (userIdOrError.isErr()) {
      throw new Error(userIdOrError.unwrapErr().message);
    }
    const userId = userIdOrError.unwrap();

    const nameOrError = Name.create(userRecord.name);
    if (nameOrError.isErr()) {
      throw new Error(nameOrError.unwrapErr().message);
    }
    const name = nameOrError.unwrap();

    const emailOrError = Email.create(userRecord.email);
    if (emailOrError.isErr()) {
      throw new Error(emailOrError.unwrapErr().message);
    }
    const email = emailOrError.unwrap();

    const passwordOrError = Password.createHashed(userRecord.password);
    if (passwordOrError.isErr()) {
      throw new Error(passwordOrError.unwrapErr().message);
    }
    const password = passwordOrError.unwrap();

    const phoneOrError = Phone.create(userRecord.phone);
    if (phoneOrError.isErr()) {
      throw new Error(phoneOrError.unwrapErr().message);
    }
    const phone = phoneOrError.unwrap();

    if (!userRecord.role) {
      throw new Error("Role is null or undefined.");
    }
    const roleOrError = Role.create(userRecord.role.id);
    if (roleOrError.isErr()) {
      throw new Error(roleOrError.unwrapErr().message);
    }
    const role = roleOrError.unwrap();

    const provinceIdsOrError = ProvinceId.createList(
      userRecord.userProvince.map((up: any) => up.province.id),
    );
    if (provinceIdsOrError.isErr()) {
      throw new Error(provinceIdsOrError.unwrapErr().message);
    }
    const provinceIds = provinceIdsOrError.unwrap();

    const userOrError = User.createExisting(
      userId,
      name,
      email,
      password,
      phone,
      role,
      provinceIds,
    );
    if (userOrError.isErr()) {
      throw new Error(userOrError.unwrapErr().message);
    }

    return userOrError.unwrap();
  }

  private mapToOrmData(user: User): any {
    return {
      id: user.id.value,
      name: user.name.value,
      email: user.email.value,
      password: user.password.getHashedValue(),
      phone: user.phone.value,
      role: user.role.getValue(),
      provinceIds: user.provinceIds.map((p) => ({ value: p.value })),
    };
  }
}