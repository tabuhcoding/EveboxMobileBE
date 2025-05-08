import { ApiProperty } from "@nestjs/swagger";
import { BaseResponse } from "src/shared/constants/baseResponse";

class ImageDto {
  @ApiProperty({ example: 203 })
  id: number;

  @ApiProperty({ example: 'https://salt.tkbcdn.com/ts/ds/09/3e/43/f49f47a91a829333bec0e34298e54dae.jpg' })
  imageUrl: string;
}

class TicketTypeDto {
  @ApiProperty({ example: '1030527' })
  id: string;

  @ApiProperty({ example: 'THƯỜNG' })
  name: string;

  @ApiProperty({ example: '', description: 'Description of the ticket type' })
  description: string;

  @ApiProperty({ example: '#86f0ff' })
  color: string;

  @ApiProperty({ example: false })
  isFree: boolean;

  @ApiProperty({ example: 330000 })
  price: number;

  @ApiProperty({ example: 330000 })
  originalPrice: number;

  @ApiProperty({ example: 10 })
  maxQtyPerOrder: number;

  @ApiProperty({ example: 1 })
  minQtyPerOrder: number;

  @ApiProperty({ example: '2024-12-14T03:00:00.000Z' })
  startTime: Date;

  @ApiProperty({ example: '2024-12-27T12:30:00.000Z' })
  endTime: Date;

  @ApiProperty({ example: 1 })
  position: number;

  @ApiProperty({ example: 'book_now' })
  status: string;

  @ApiProperty({ example: '' })
  imageUrl: string;

  @ApiProperty({ example: false })
  isHidden: boolean;
}

class ShowingDto {
  @ApiProperty({ example: '97930557637546' })
  id: string;

  @ApiProperty({ example: 22691 })
  eventId: number;

  @ApiProperty({ example: 'book_now' })
  status: string;

  @ApiProperty({ example: false })
  isFree: boolean;

  @ApiProperty({ example: true })
  isSalable: boolean;

  @ApiProperty({ example: false })
  isPresale: boolean;

  @ApiProperty({ example: 39 })
  seatMapId: number;

  @ApiProperty({ example: '2024-12-27T12:30:00.000Z' })
  startTime: Date;

  @ApiProperty({ example: '2024-12-27T15:30:00.000Z' })
  endTime: Date;

  @ApiProperty({ example: false })
  isEnabledQueueWaiting: boolean;

  @ApiProperty({ example: true })
  showAllSeats: boolean;

  @ApiProperty({ type: [TicketTypeDto] })
  TicketType: TicketTypeDto[];
}

class CategoryDto {
  @ApiProperty({ example: 5 })
  id: number;

  @ApiProperty({ example: 'theatersandart' })
  name: string;
}

export class EventDetailResponseDto {
  @ApiProperty({ example: 22691 })
  id: number;

  @ApiProperty({ example: 'SÂN KHẤU THIÊN ĐĂNG : NHỮNG CON MA NHÀ HÁT' })
  title: string;

  @ApiProperty({ example: '<p><strong>&#34;NHỮNG CON MA NHÀ HÁT&#34;</strong></p>...' })
  description: string;

  @ApiProperty({ example: '2024-12-27T12:30:00.000Z' })
  startDate: Date;

  @ApiProperty({ example: null, nullable: true })
  organizerId: number | null;

  @ApiProperty({ example: 'book_now' })
  status: string;

  @ApiProperty({ example: 20 })
  locationId: number;

  @ApiProperty({ example: 'Sân khấu Thien Dang' })
  venue: string;

  @ApiProperty({ type: ImageDto })
  Images_Events_imgLogoIdToImages: ImageDto;

  @ApiProperty({ type: ImageDto })
  Images_Events_imgPosterIdToImages: ImageDto;

  @ApiProperty({ example: '2024-12-17T07:57:23.528Z' })
  createdAt: Date;

  @ApiProperty({ example: false })
  isOnline: boolean;

  @ApiProperty({ example: '62 Trần Quang Khải, Tan Dinh Ward, 1 District, Ho Chi Minh City' })
  locationsString: string;

  @ApiProperty({ example: '50' })
  lastScore: string;

  @ApiProperty({ example: false })
  isSpecial: boolean;

  @ApiProperty({ example: false })
  isOnlyOnEve: boolean;

  @ApiProperty({ example: "Nha hat kich Idecaf", description: 'Organizer name' })
  orgName: string;

  @ApiProperty({ example: 'Nha hat kich Idecaf', description: 'Organizer description' })
  orgDescription: string;

  @ApiProperty({ type: [CategoryDto] })
  categories: CategoryDto[];

  @ApiProperty({ type: [ShowingDto] })
  showing: ShowingDto[];
}

export class EventDetailResponse extends BaseResponse {
  @ApiProperty({type: EventDetailResponseDto, description: 'Event details'})
  data: EventDetailResponseDto;
}