import { ApiProperty } from "@nestjs/swagger";
import { BaseResponse } from "src/shared/constants/baseResponse";

export class LoginResponseData {
  @ApiProperty({ example: 'JWT access token', description: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ example: 'JWT refresh token', description: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refresh_token: string;
}

export class LoginResponse extends BaseResponse {
  @ApiProperty({ type: LoginResponseData })
  data: LoginResponseData
}