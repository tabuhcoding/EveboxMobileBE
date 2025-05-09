import { Controller, Get, Param, UseGuards, Request, HttpStatus, Res } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/guard/jwt-auth.guard';
import { GetEventRoleByIdService } from './getEventRoleById.service';
import { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EventRoleItemDto } from '../getEventRoles/getEventRoles-response.dto';
import { GetEventRoleByIdResponseDto } from './getEventRoleById-response.dto';

@ApiTags('Event - Roles')
@Controller('api/event/role')
export class GetEventRoleByIdController {
  constructor(private readonly service: GetEventRoleByIdService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get permissions of a specific event role by ID' })
  @ApiResponse({
    status: 200,
    description: 'Role data',
    type: GetEventRoleByIdResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden: Only organizers allowed' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async getRoleById(@Param('id') idRaw: string, @Request() req: any, @Res() res: Response) {
    const id = parseInt(idRaw, 10);
    if (isNaN(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Invalid role ID',
      });
    }

    try {
      const result = await this.service.execute(req.user.email, id);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: error.status || 500,
        message: error.message || 'Internal server error',
      });
    }
  }
}
