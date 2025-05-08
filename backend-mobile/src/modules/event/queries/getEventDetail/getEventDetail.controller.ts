import { Controller, Get, Query, HttpStatus, Res } from "@nestjs/common";
import { Response } from "express";
import { GetEventDetailService } from "./getEventDetail.service";
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorHandler } from 'src/shared/exceptions/error.handler';
import { EventDetailResponse } from './getEventDetail-response.dto';

@ApiTags('Event')
@Controller('api/event/detail')
export class GetEventDetailController {
  constructor(private readonly eventDetailService: GetEventDetailService) { }
  @Get('/')
  @ApiOperation({ summary: 'Get event details' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Event details retrieved successfully',
    type: EventDetailResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Event not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async getEventDetail(
    @Query('eventId') eventId: string,
    @Res() res: Response
  ) {
    try {
      const result = await this.eventDetailService.execute(parseInt(eventId));

      if (result.isErr()) {
        const error = result.unwrapErr();
        return res
          .status(error.message === "Event not found." ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST)
          .json(error.message === "Event not found." ? ErrorHandler.notFound(result.unwrapErr().message) : ErrorHandler.badRequest(result.unwrapErr().message));
      }

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Organizer revenue retrieved successfully',
        data: result.unwrap(),
      });
    } catch (error) {
      console.log("🚀 ~ GetSummaryTicketRevenueController ~ error:", error)
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      });
    }
  }
}