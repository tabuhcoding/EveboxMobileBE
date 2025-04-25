import { Controller, Get, Post, Delete, Param, UploadedFile, UseInterceptors, Res, HttpStatus, Patch, Put } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ImagesService } from './images.service';
import { ErrorHandler } from 'src/shared/exceptions/error.handler';
import { ImagesResponseDto } from './images-response.dto';

@Controller('api/images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('/upload')
  @ApiOperation({ summary: 'Upload an image' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Image uploaded successfully', type: ImagesResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    if (!file) {
      return res.status(HttpStatus.BAD_REQUEST).json(ErrorHandler.badRequest('No file uploaded'));
    }
    const result = await this.imagesService.uploadImage(file.buffer, file.originalname);

    if (result.isErr()) {
      return res.status(HttpStatus.BAD_REQUEST).json(ErrorHandler.badRequest(result.unwrapErr().message));
    }

    const data = result.unwrap();
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'Image uploaded successfully',
      data,
    });
  }

  // @Get('/')
  // @ApiOperation({ summary: 'Get all images' })
  // @ApiResponse({ status: HttpStatus.OK, description: 'All images retrieved successfully' })
  // @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' })
  // async getAllImages(@Res() res: Response) {
  //   const result = await this.imagesService.findAll();

  //   if (result.isErr()) {
  //     return res.status(HttpStatus.BAD_REQUEST).json(ErrorHandler.badRequest(result.unwrapErr().message));
  //   }

  //   const data = result.unwrap();
  //   return res.status(HttpStatus.OK).json({
  //     statusCode: HttpStatus.OK,
  //     message: 'All images retrieved successfully',
  //     data,
  //   });
  // }

  @Get('/:id')
  @ApiQuery({
      name: 'imageId',
      required: true,
      example: '1',
      description: 'The ID of the image to retrieve',
    })
  @ApiOperation({ summary: 'Get an image by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Image retrieved successfully', type: ImagesResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Image not found' })
  async getImage(@Param('id') id: string, @Res() res: Response) {
    const result = await this.imagesService.findOne(Number(id));

    if (result.isErr()) {
      return res.status(HttpStatus.NOT_FOUND).json(ErrorHandler.notFound(result.unwrapErr().message));
    }

    const data = result.unwrap();
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Image retrieved successfully',
      data,
    });
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update an image by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Image updated successfully', type: ImagesResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Image not found' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' })
  @UseInterceptors(FileInterceptor('file'))
  async updateImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    const result = await this.imagesService.update(Number(id), file.buffer, file.originalname);

    if (result.isErr()) {
      return res.status(HttpStatus.NOT_FOUND).json(ErrorHandler.notFound(result.unwrapErr().message));
    }

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Image updated successfully',
    });
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete an image by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Image deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Image not found' })
  async removeImage(@Param('id') id: string, @Res() res: Response) {
    const result = await this.imagesService.remove(Number(id));

    if (result.isErr()) {
      return res.status(HttpStatus.NOT_FOUND).json(ErrorHandler.notFound(result.unwrapErr().message));
    }

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Image deleted successfully',
    });
  }
}
