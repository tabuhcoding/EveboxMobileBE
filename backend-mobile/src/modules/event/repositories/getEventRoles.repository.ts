import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';

@Injectable()
export class GetEventRolesRepository {
  constructor(private readonly prisma: PrismaService) {}

  // async isOrganizer(email: string): Promise<boolean> {
  //   const organizer = await this.prisma.events.findFirst({
  //     where: { organizerId: email },
  //     select: { id: true },
  //   });
  //   return !!organizer;
  // }

  async findAllRoles() {
    return this.prisma.eventRole.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findById(id: number) {
    return this.prisma.eventRole.findUnique({
      where: { id },
    });
  }
}
