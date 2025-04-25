import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../../../../infrastructure/adapters/cloudinary/cloudinary.service';
import { ImagesRepository } from '../../repositories/images.repository';
import { Result, Ok, Err } from 'oxide.ts';
import { Images } from '../../domain/entities/images.entity';

@Injectable()
export class ImagesService {
  constructor(
    private readonly imagesRepository: ImagesRepository,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async uploadImage(fileBuffer: Buffer, fileName: string, userId?: string): Promise<Result<Images, Error>> {
    try {
      const uploadResult = await this.cloudinaryService.uploadImage(fileBuffer, fileName);
      const image = await this.imagesRepository.create(uploadResult.secure_url, userId);
      return Ok(image);
    } catch (error) {
      return Err(new Error('Failed to upload image'));
    }
  }

  async findAll(): Promise<Result<Images[], Error>> {
    try {
      const images = await this.imagesRepository.findAll();
      return Ok(images);
    } catch (error) {
      return Err(new Error('Failed to retrieve images'));
    }
  }

  async findOne(id: number): Promise<Result<Images, Error>> {
    try {
      const image = await this.imagesRepository.findOne(id);
      if (!image) return Err(new Error('Image not found'));
      return Ok(image);
    } catch (error) {
      return Err(new Error('Failed to retrieve image'));
    }
  }

  async update(id: number, fileBuffer: Buffer, fileName: string): Promise<Result<Images, Error>> {
    try {
      const image = await this.imagesRepository.findOne(id);
      if (!image) return Err(new Error('Image not found'));
      const uploadResult = await this.cloudinaryService.uploadImage(fileBuffer, fileName);
      const updatedImage = await this.imagesRepository.update(id, uploadResult.secure_url);
      return Ok(updatedImage);
    } catch (error) {
      return Err(new Error('Failed to update image'));
    }
  }

  async remove(id: number): Promise<Result<void, Error>> {
    try {
      const image = await this.imagesRepository.findOne(id);
      if (!image) return Err(new Error('Image not found'));
      await this.imagesRepository.remove(id);
      return Ok(undefined);
    } catch (error) {
      return Err(new Error('Failed to delete image'));
    }
  }
}
