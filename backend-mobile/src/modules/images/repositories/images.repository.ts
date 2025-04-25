import { Injectable } from '@nestjs/common';
import { PrismaService } from "../../../infrastructure/database/prisma/prisma.service";
import { Images } from '../domain/entities/images.entity';

@Injectable()
export class ImagesRepository {
  constructor(private prisma: PrismaService) {}

  async create(imageUrl: string, userId?: string): Promise<Images> {
    const image = await this.prisma.images.findFirst({ where: { imageUrl } });
    if (image) {
      return image;
    }
    return this.prisma.images.create({ data: { imageUrl, userId } });
  }

  async findAll(): Promise<Images[]> {
    return this.prisma.images.findMany();
  }

  async findOne(id: number): Promise<Images | null> {
    return this.prisma.images.findUnique({ where: { id } });
  }

  async update(id: number, imageUrl: string): Promise<Images> {
    return this.prisma.images.update({ where: { id }, data: { imageUrl } });
  }

  async remove(id: number): Promise<Images> {
    return this.prisma.images.delete({ where: { id } });
  }
}
