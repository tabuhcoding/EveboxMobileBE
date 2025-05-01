import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/infrastructure/database/prisma/prisma.service";
import { Result, Ok, Err } from "oxide.ts";
import { CheckInTicketRepository } from "./checkInTicket.repository";
import { decrypt } from "src/utils/utils";
import { CheckInTicketByQrResponse } from "../commands/checkInTicketByQr/checkInTicketByQr-response.dto";

@Injectable()
export class CheckInTicketByQrRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly checkInTicketRepository: CheckInTicketRepository
  ) {}
  
  async checkInByQr(encryptedQrData: string, email: string): Promise<Result<CheckInTicketByQrResponse, Error>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email }
      })

      if (!user) {
        return Err(new Error(`User with email ${email} not found`))
      }

      const decryptedData = decrypt(encryptedQrData);
      const { ticketQrId, eventId } = decryptedData;

      if (!ticketQrId || !eventId) {
        return Err(new Error('Ticket or event is not exist'));
      }

      const result = await this.checkInTicketRepository.checkInTicket(ticketQrId, email, eventId);

      if (result.isErr()) {
        return Err(new Error('Failed to check in ticket by QR'));
      }

      return Ok({
        success: true
      });
    } catch (error) {
      return Err(new Error('Failed to check in ticket by QR'));
    }
  }
}