import { Controller, Get, Res, Query, HttpStatus, UseGuards, Request } from "@nestjs/common";
import { Response } from "express";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorHandler } from 'src/shared/exceptions/error.handler';
import { JwtAuthGuard } from 'src/shared/guard/jwt-auth.guard';
import { GetCheckedInTicketsService } from "./getCheckedInTickets.service";
import { CheckedInTicketsResponseDto } from "./getCheckedInTickets-response.dto";

@ApiTags('Ticket')
@Controller('api/ticket')
export class GetCheckedInTicketsController {
  constructor(private readonly getCheckedInTicketsService: GetCheckedInTicketsService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/checkin-tickets')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get checked-in tickets of showing' })
  @ApiQuery({
    name: 'showingId',
    required: true,
    example: '16962844867169',
    description: 'The ID of the showing to retrieve',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Checked-in tickets retrieved successfully',
    type: CheckedInTicketsResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to get checked-in tickets',
  })
  async getCheckedInTickets(
    @Request() req,
    @Res() res: Response,
    @Query('showingId') showingId: string
  ) {
    try {
      const user = req.user;

      const result = await this.getCheckedInTicketsService.execute(showingId, user.email);

      if (result.isErr()) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: result.unwrapErr().message,
        });
      }

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Checked-in tickets retrieved successfully',
        data: result.unwrap(),
      });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      });
    };
  }
}