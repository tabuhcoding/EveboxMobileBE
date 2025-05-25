import { Controller,Post, Body, Res, HttpStatus, Request, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { ApiBadRequestResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse, ApiResponse } from "@nestjs/swagger";

import { CreatePinUserDto } from "./create-pin.dto";
import { CreatePinUserCommand } from "./create-pin.command";
import { ErrorHandler } from "src/shared/exceptions/error.handler";
import { USER_MESSAGES } from "src/shared/constants/constants";
import { CreatePinUserService } from "./create-pin.service";
import { JwtAuthGuard } from "src/shared/guard/jwt-auth.guard";

@ApiTags('User')
@Controller('api/user')
export class CreatePinUserController {
  constructor(private readonly createPinUserService: CreatePinUserService) {}
  
  @UseGuards(JwtAuthGuard)
  @Post('pin')
  @ApiOperation({
    summary: 'Create Pin',
    description: 'Creates a new pin for the user'
  })
  @ApiBadRequestResponse({
    description: 'Invalid input format'
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials'
  })
  @ApiResponse({
    status: 200,
    description: 'Pin created successfully',
    type: CreatePinUserDto,
  })

  async createPin(@Request() req, @Body() createPinUserDto: CreatePinUserDto, @Res() res: Response) {
    const command = new CreatePinUserCommand(
      createPinUserDto.pin,
      req.user.email,
    );

    const result = await this.createPinUserService.execute(command);

    if (result.isErr()) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json(ErrorHandler.badRequest(result.unwrapErr().message));
    }
    
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: USER_MESSAGES.SUCCESS.PIN_CREATED,
    });
  }
}