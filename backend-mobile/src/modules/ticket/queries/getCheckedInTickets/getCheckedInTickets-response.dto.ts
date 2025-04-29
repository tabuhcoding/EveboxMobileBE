import { ApiProperty } from "@nestjs/swagger";
import { BaseResponse } from "src/shared/constants/baseResponse";

class CheckedInTicketQRCodeDto {
  @ApiProperty({ example: '3671d719-4f12-486d-9b6c-b8343b4c64de', description: 'The id of the ticket' })
  ticketQrId: string;

  @ApiProperty({ example: 'qrCode-example-5678', description: 'The qr code of the ticket' })
  qrCode: string;

  @ApiProperty({ example: '1321', description: 'The ticket type id of the ticket' })
  ticketTypeId: string;

  @ApiProperty({ example: 78, description: 'The seat id of the ticket' })
  seatId?: number;
}

export class CheckedInTicketsData {
  @ApiProperty({example: '3671d719-4f12-486d-9b6c-b8343b4c64de', description: 'The id of the ticket' })
  id: string;

  @ApiProperty({example: '169898227', description: 'The showing id of the ticket' })
  showingId: string;

  @ApiProperty( {example: 1, description: 'The status of the ticket' })
  status: number;

  @ApiProperty({example: "Ve dien tu", description: 'Type of ticket' })
  type: string;

  @ApiProperty({example: 540000, description: 'The price of the ticket' })
  price: number;

  @ApiProperty({example: '2021-10-10T10:00:00Z', description: 'The paid time of the ticket' })
  paidAt: Date;

  @ApiProperty({type: [CheckedInTicketQRCodeDto], description: 'Tickets include QR code, ticket info' })
  ticketQrCode?: CheckedInTicketQRCodeDto[]

  @ApiProperty({example: '2021-10-10T10:00:00Z', description: 'The start time of the showing' })
  startTime: Date;

  @ApiProperty({example: '2021-10-10T12:00:00Z', description: 'The end time of the showing' })
  endTime: Date;

  @ApiProperty({example: 'The Batman', description: 'The title of the event' })
  eventTitle: string;

  @ApiProperty({example: 'Nhà hát kịch Idecaf', description: 'The venue of the event' })
  eventVenue: string;

  @ApiProperty({example: '130 Nguyen Dinh Chieu, Da Kao Ward, District 1, Ho Chi Minh City', description: 'The address of the event' })
  locationsString: string;
}

export class CheckedInTicketsResponseDto extends BaseResponse {
  @ApiProperty({type: [CheckedInTicketsData], description: 'Checked in tickets info' })
  data: CheckedInTicketsData[]
}