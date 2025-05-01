import { Controller, Get, Query, Res, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorHandler } from 'src/shared/exceptions/error.handler';
import { JwtAuthGuard } from 'src/shared/guard/jwt-auth.guard';
import { GetUserTicketService } from './getUserTicket.service';
import { GetUserTicketResponseDto } from './getUserTicket-response.dto';

@ApiTags('Ticket')
@Controller('api/ticket')
export class GetUserTicketController {
  constructor(private readonly getUserTicketService: GetUserTicketService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/getUserTicket')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get status of all payment method' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ticket data retrieved successfully',
    type: GetUserTicketResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async getShowing(
    @Request() req,
    @Res() res: Response) {
    const email = req.user.email;
    // const email = 'dattruong01082@gmail.com';
    const result = await this.getUserTicketService.execute(email);
    if (result.isErr()) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorHandler.internalServerError(result.unwrapErr().message));
    }

    const data = result.unwrap();
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Ticket data retrieved successfully',
      data,
    });
  }
}