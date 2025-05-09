import { IsOptional, IsEmail } from 'class-validator';

export class GetEventMembersQueryDto {
  @IsOptional()
  @IsEmail()
  email?: string;
}