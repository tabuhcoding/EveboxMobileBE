import { Controller, Post, Res, UseGuards, HttpStatus, Request } from "@nestjs/common";
import { Response } from "express";
import { ApiOperation, ApiResponse, ApiTags, ApiHeader, ApiOkResponse, ApiUnauthorizedResponse, ApiInternalServerErrorResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/shared/guard/jwt-auth.guard";
import { ErrorHandler } from "src/shared/exceptions/error.handler";
import { LogoutUserService } from "./logout-user.service";
import { LogoutResponse } from "./logout-user-response.dto";
import { USER_MESSAGES } from "src/shared/constants/constants";

@ApiTags('Authentication')
@Controller('api/user')
export class LogoutUserController {
  constructor(private readonly logoutService: LogoutUserService) {}

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ 
    summary: 'User logout',
    description: 'Invalidate user session and revoke refresh token'
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for authorization (`Bearer <token>`)',
    required: true,
  })
  @ApiOkResponse({
    description: 'User logged out successfully',
    type: LogoutResponse
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing token'
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error while logging out'
  })
  async logout(@Request() req, @Res() res: Response) {
    try {
      // Call service with token
      await this.logoutService.execute(req.user.email);

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: USER_MESSAGES.SUCCESS.LOGOUT,
        data: null
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(ErrorHandler.internalServerError(USER_MESSAGES.ERRORS.SERVER_ERROR));
    }
  }
}