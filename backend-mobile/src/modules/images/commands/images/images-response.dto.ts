import { ApiProperty } from '@nestjs/swagger';

export class ImagesResponseData {
  @ApiProperty({
    description: 'Image ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Image URL',
    example: 'https://example.com/image.jpg',
  })
  imageUrl: string;
}

export class ImagesResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({
    example: 'Image operation successful',
    description: 'Success message',
  })
  message: string;

  @ApiProperty({
    type: ImagesResponseData,
  })
  data: ImagesResponseData;
}
