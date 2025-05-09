import { Controller, Get, Query, Res, HttpStatus, UseGuards, Request, Param } from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorHandler } from 'src/shared/exceptions/error.handler';
import { JwtAuthGuard } from 'src/shared/guard/jwt-auth.guard';
import { GetEventOfOrgDetailService } from './getEventOfOrgDetail.service';
import { EventOrgDetailResponse } from './getEventOfOrgDetail-response.dto';

@ApiTags('Org - Event')
@Controller('api/org/event')
export class GetEventOfOrgDetailController {
  constructor(private readonly getEventOfOrgDetailService: GetEventOfOrgDetailService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get Event Detail Of Organizer' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Event Detail Of Organizer retrieved successfully',
    type: EventOrgDetailResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async getShowing(
    @Request() req,
    @Param('id') eventId: number,
    @Res() res: Response) {
    try{
      const email = req.user.email;
      const result = await this.getEventOfOrgDetailService.findAll(email, eventId);
      if (result.isErr()) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: result.unwrapErr().message,
        });
      }

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Event details retrieved successfully',
        data: result.unwrap(),
      });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      });
    }    
  }
}