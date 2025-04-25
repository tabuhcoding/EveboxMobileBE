import { Controller, Get, HttpStatus, Res, UseGuards, Request } from "@nestjs/common";
import { Response } from "express";
import { ApiTags, ApiOperation, ApiHeader, ApiNotFoundResponse, ApiUnauthorizedResponse, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from "src/shared/guard/jwt-auth.guard";
import { ErrorHandler } from "src/shared/exceptions/error.handler";
import { UserResponse } from "./get-user-response.dto";
import { GetUserService } from "./get-user.service";

@ApiTags('User')
@Controller('api/user')
export class GetUserController {
  constructor(private readonly userService: GetUserService) { }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({
    summary: 'Get Current User Details',
    description: 'Retrieves details of the currently authenticated user'
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authorization (`Bearer <token>`)',
    required: true
  })
  @ApiOkResponse({
    description: 'User details fetched successfully',
    type: UserResponse
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing token'
  })
  @ApiNotFoundResponse({
    description: 'User not found'
  })
  async getCurrentUser(
    @Request() req,
    @Res() res: Response
  ) {
    const currentUser = await this.userService.execute(req.user.email);

    if (currentUser.isErr()) {
      return res.status(404).json(ErrorHandler.notFound('User not found'));
    }

    return res.status(HttpStatus.OK).json({
      statusCode: 200,
      message: 'User details fetched successfully',
      data: {
        ...currentUser.unwrap(),
      }
    });
  }
}
