import { Controller,Post, Body, Res, HttpStatus, Request, Put, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { ApiBadRequestResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse, ApiResponse } from "@nestjs/swagger";

import { ChangePinUserDto } from "./change-pin.dto";
import { ChangePinUserCommand } from "./change-pin.command";
import { ErrorHandler } from "src/shared/exceptions/error.handler";
import { USER_MESSAGES } from "src/shared/constants/constants";
import { ChangePinUserService } from "./change-pin.service";
import { JwtAuthGuard } from "src/shared/guard/jwt-auth.guard";

@ApiTags('User')
@Controller('api/user')
export class ChangePinUserController {
  constructor(private readonly changePinUserService: ChangePinUserService) {}
  
  @UseGuards(JwtAuthGuard)
  @Put('pin')
  @ApiOperation({
    summary: 'Change Pin',
    description: 'Changes the existing pin for the user'
  })
  @ApiBadRequestResponse({
    description: 'Invalid input format'
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials'
  })
  @ApiResponse({
    status: 200,
    description: 'Pin changed successfully',
    type: ChangePinUserDto,
  })

  async createPin(@Request() req, @Body() changePinUserDto: ChangePinUserDto, @Res() res: Response) {
    const command = new ChangePinUserCommand(
      changePinUserDto.pin,
      req.user.email,
    );

    const result = await this.changePinUserService.execute(command);

    if (result.isErr()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ErrorHandler.badRequest(result.unwrapErr().message));
    }
    
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: USER_MESSAGES.SUCCESS.PIN_CHANGED,
    });
  }
}