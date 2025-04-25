import { ApiProperty } from "@nestjs/swagger";
import { BaseResponse } from "src/shared/constants/baseResponse";

export class LogoutResponse extends BaseResponse {
  @ApiProperty({ type: 'null', example: null, description: 'No data returned' })
  data: null;
}