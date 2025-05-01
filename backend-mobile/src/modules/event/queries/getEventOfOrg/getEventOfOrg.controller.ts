import { Controller, Get, Query, Res, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorHandler } from 'src/shared/exceptions/error.handler';
import { JwtAuthGuard } from 'src/shared/guard/jwt-auth.guard';
import { GetEventOfOrgService } from './getEventOfOrg.service';
import { EventOrgFrontDisplayResponse } from './getEventOfOrg-response.dto';

@ApiTags('Org - Event')
@Controller('api/org/event')
export class GetEventOfOrgController {
  constructor(private readonly getEventOfOrgService: GetEventOfOrgService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all Event Of Organizer' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Event Of Organizer retrieved successfully',
    type: EventOrgFrontDisplayResponse,
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
    @Res() res: Response) {
    try{
      const email = req.user.email;
      const result = await this.getEventOfOrgService.findAll(email);
      if (result.isErr()) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: result.unwrapErr().message,
        });
      }

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Event updated successfully',
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