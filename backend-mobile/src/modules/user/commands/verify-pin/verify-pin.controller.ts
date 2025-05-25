import { Controller, Post, Body, Res, HttpStatus, Request, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { ApiBadRequestResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

import { VerifyPinResponse, VerifyPinUserDto } from "./verify-pin.dto";
import { VerifyPinUserCommand } from "./verify-pin.command";
import { ErrorHandler } from "src/shared/exceptions/error.handler";
import { USER_MESSAGES } from "src/shared/constants/constants";
import { VerifyPinUserService } from "./verify-pin.service";
import { JwtAuthGuard } from "src/shared/guard/jwt-auth.guard";

@ApiTags('User')
@Controller('api/user')
export class VerifyPinUserController {
  constructor(private readonly verifyPinUserService: VerifyPinUserService) {}

  @UseGuards(JwtAuthGuard)
  @Post('pin/verify')
  @ApiOperation({
    summary: 'Verify PIN',
    description: 'Verifies the user PIN'
  })
  @ApiBearerAuth('access-token')
  @ApiBadRequestResponse({
    description: 'Invalid input format'
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials'
  })
  @ApiResponse({
    status: 200,
    description: 'PIN verification result',
    type: VerifyPinResponse,
  })
  async verifyPin(@Request() req, @Body() verifyPinUserDto: VerifyPinUserDto, @Res() res: Response) {
    const command = new VerifyPinUserCommand(
      verifyPinUserDto.pin,
      req.user.email,
    );

    const result = await this.verifyPinUserService.execute(command);

    if (result.isErr()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ErrorHandler.badRequest(result.unwrapErr().message));
    }

    const verificationResult = result.unwrap();
    
    if (verificationResult.isValid) {
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: USER_MESSAGES.SUCCESS.PIN_VERIFIED,
        data: verificationResult
      });
    } else {
      if (verificationResult.lockedUntil) {
        return res.status(HttpStatus.FORBIDDEN).json({
          statusCode: HttpStatus.FORBIDDEN,
          message: `Account locked until ${verificationResult.lockedUntil}`,
          data: verificationResult
        });
      } else {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: `Invalid PIN. ${verificationResult.remainingAttempts} attempts remaining.`,
          data: verificationResult
        });
      }
    }
  }
}