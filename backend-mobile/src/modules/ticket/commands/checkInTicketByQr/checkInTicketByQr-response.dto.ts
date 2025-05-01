import { ApiProperty } from "@nestjs/swagger";
import { BaseResponse } from "src/shared/constants/baseResponse";

export class CheckInTicketByQrResponse {
  @ApiProperty({ example: true, description: 'True if check in successfully, False if error' })
  success: boolean;
}

export class CheckInTicketByQrResponseDto extends BaseResponse {
  @ApiProperty({ type: CheckInTicketByQrResponse })
  data: CheckInTicketByQrResponse;
}