import {
    Controller,
    Get,
    UseGuards,
    Request,
    HttpStatus,
    Res,
  } from '@nestjs/common';
  import { Response } from 'express';
  import { JwtAuthGuard } from 'src/shared/guard/jwt-auth.guard';
  import { GetEventRolesService } from './getEventRoles.service';
  import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
  } from '@nestjs/swagger';
  import { GetEventRolesResponseDto } from './getEventRoles-response.dto';
  
  @ApiTags('Event - Roles')
  @Controller('api/event/role')
  export class GetEventRolesController {
    constructor(private readonly getEventRolesService: GetEventRolesService) {}
  
    @UseGuards(JwtAuthGuard)
    @Get('/')
    @ApiBearerAuth('access-token')  
    @ApiOperation({ summary: 'Get all event roles and their permissions' })
    @ApiResponse({
      status: 200,
      description: 'Successfully retrieved roles and permissions',
      type: GetEventRolesResponseDto,
    })
    @ApiResponse({ status: 403, description: 'Forbidden: Only organizers allowed' })
    async getRoles(@Request() req: any, @Res() res: Response) {
      try {
        const result = await this.getEventRolesService.execute(req.user.email);
        return res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          message: 'Success',
          data: result,
        });
      } catch (error) {
        console.error('Error fetching event roles:', error);
        return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: error.status || 500,
          message: error.message || 'Internal server error',
        });
      }
    }
  }
  