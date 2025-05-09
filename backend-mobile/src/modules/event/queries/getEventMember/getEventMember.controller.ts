import {
  Controller,
  Get,
  Query,
  Param,
  Req,
  Res,
  HttpStatus,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import {  Response } from 'express';
import { JwtAuthGuard } from 'src/shared/guard/jwt-auth.guard';
import { GetEventMembersService } from './getEventMembers.service';
import { GetEventMembersQueryDto } from './getEventMembers.query.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetEventMembersResponseDto } from './getEventMembers-response.dto';

@ApiTags('Org - EventMember')
@Controller('org/member')
export class GetEventMemberController {
  constructor(private readonly service: GetEventMembersService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':eventId')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all members of an event (optionally filter by email)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of event members', type: GetEventMembersResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' })
  async getMembers(
    @Param('eventId') eventIdRaw: string,
    @Query() query: GetEventMembersQueryDto,
    @Request() req,
    @Res() res: Response,
  ) {
    try {
      const eventId = parseInt(eventIdRaw, 10);
      if (isNaN(eventId)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid eventId',
        });
      }

      const result = await this.service.execute(eventId, (req.user as any).email, query);

      if (result.isErr()) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: result.unwrapErr().message,
        });
      }

      return res.status(HttpStatus.OK).json(result.unwrap());
    } catch (error) {
      console.error('[GetEventMemberController]', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      });
    }
  }
}
