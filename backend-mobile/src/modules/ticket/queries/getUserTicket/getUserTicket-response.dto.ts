import { ApiProperty } from '@nestjs/swagger';

class UserEventDto {
  @ApiProperty( {example: 'The Batman', description: 'The title of the event' })
  title: string;

  @ApiProperty( {example: 'Nhà hát kịch Idecaf', description: 'The venue of the event' })
  venue: string;

  @ApiProperty( {example: '130 Nguyen Dinh Chieu, Da Kao Ward, District 1, Ho Chi Minh City', description: 'The address of the event' })
  locationsString: string;

  // @ApiProperty( {example: 'The Batman is a 2022 American superhero film based on the DC Comics character Batman.', description: 'The description of the event' })
  // description: string;
}

class UserShowingDto {
  @ApiProperty( {example: '2021-10-10T10:00:00Z', description: 'The start time of the showing' })
  startTime: Date;

  @ApiProperty( {example: '2021-10-10T12:00:00Z', description: 'The end time of the showing' })
  endTime: Date;

  @ApiProperty( {type: UserEventDto, description: 'The event of the showing' })
  Events: UserEventDto;
}

// class UserFormInputDto {
//   @ApiProperty( {example: 'name', description: 'The field name of the form input' })
//   fieldName: string;
// }

// class UserFormAnserDto {
//   @ApiProperty( {type: UserFormInputDto, description: 'The form input of the form answer' })
//   formInput: UserFormInputDto;

//   @ApiProperty( {example: 'Duong Ngoc Thai Bao', description: 'The value of the form answer' })
//   value: string;
// }

// class UserFormResponseDto {
//   @ApiProperty( {type: UserFormAnserDto, description: 'The answers of the form response' })
//   answers: UserFormAnserDto[];
// }

class PaymentInfoDto {
  @ApiProperty( {example: '2021-10-10T10:00:00Z', description: 'The paid time of the ticket' })
  paidAt: Date;
}

class TicketQRCodeDto {
  @ApiProperty( {example: '9090909090900qq8qqw7d', description: 'The qr code of the ticket' })
  qrCode: string;

  @ApiProperty( {example: '1321', description: 'The ticket type id of the ticket' })
  ticketTypeId: string;

  @ApiProperty( {example: 78, description: 'The seat id of the ticket' })
  seatId?: number;
}

export class UserTicketDto {
  @ApiProperty( {example: '3671d719-4f12-486d-9b6c-b8343b4c64de', description: 'The id of the ticket' })
  id: string;

  @ApiProperty( {example: '169898227', description: 'The showing id of the ticket' })
  showingId: string;

  @ApiProperty( {example: 1, description: 'The status of the ticket' })
  status: number;

  @ApiProperty( {example: "Ve dien tu", description: 'Type of ticket' })
  type: string;

  @ApiProperty( {example: 540000, description: 'The price of the ticket' })
  price: number;

  @ApiProperty( {type: PaymentInfoDto, description: 'The payment info of the ticket' })
  PaymentInfo?: PaymentInfoDto;

  @ApiProperty( {type: [TicketQRCodeDto], description: 'The qr code of the ticket' })
  TicketQRCode?: TicketQRCodeDto[];

  @ApiProperty( {type: UserShowingDto, description: 'The showing of the ticket' })
  Showing?: UserShowingDto;

  // @ApiProperty( {type: UserFormResponseDto, description: 'The form response of the ticket' })
  // FormResponse: UserFormResponseDto;
}

export class GetUserTicketResponseDto {
  @ApiProperty({ example: 200, description: 'status code' })
  statusCode: number;

  @ApiProperty({ example: 'Get redis seat successfully', description: 'message' })
  message: string;

  @ApiProperty({ type: [UserTicketDto], description: 'The ticket data' })
  data: UserTicketDto[];
}