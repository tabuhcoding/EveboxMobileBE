import { ApiProperty } from "@nestjs/swagger";
import { ImagesResponseData } from "src/modules/images/commands/images/images-response.dto";
import { BaseResponse } from "src/shared/constants/baseResponse";

export class EventOrgFrontDisplayDto {
  @ApiProperty({ example: 22911, description: 'Event ID' })
  id: number;

  @ApiProperty({
    example: 'SÂN KHẤU / ĐOÀN CẢI LƯƠNG THIÊN LONG - CAO QUÂN BẢO ĐẠI CHIẾN DƯ HỒNG (LƯU KIM ĐÍNH)',
    description: 'Event title',
  })
  title: string;

  @ApiProperty({
    example: '2024-12-28T13:00:00.000Z',
    description: 'Event start date in ISO format',
  })
  startDate: Date;

  @ApiProperty({
    example: '2024-12-28T13:00:00.000Z',
    description: 'Event deleted at date in ISO format',
  })
  deleteAt: Date;

  @ApiProperty({ type: ImagesResponseData, description: 'Event logo image' })
  Images_Events_imgLogoIdToImages: ImagesResponseData;

  @ApiProperty({ type: ImagesResponseData, description: 'Event poster image' })
  Images_Events_imgPosterIdToImages: ImagesResponseData;

  @ApiProperty({ example: '12 duong 3/2', description: 'Event address' })
  locationString: string;

  @ApiProperty({ example: 'Nha hat Ben Thanh', description: 'Event venue' })
  venue: string;

  @ApiProperty({ example: true, description: 'Event is approved' })
  isApproved: boolean;

  @ApiProperty({ example: 0, description: 'User role in this event (0 = Organizer)' })
  role: number;
}

export class EventOrgFrontDisplayResponse extends BaseResponse {
  @ApiProperty({ type: [EventOrgFrontDisplayDto], description: 'List of events' })
  data: EventOrgFrontDisplayDto[];
}