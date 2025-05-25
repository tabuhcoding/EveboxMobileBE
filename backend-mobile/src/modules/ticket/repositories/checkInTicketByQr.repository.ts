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
      console.log("encryptedQrData", encryptedQrData);
      const user = await this.prisma.user.findUnique({
        where: { email }
      })

      if (!user) {
        return Err(new Error(`User with email ${email} not found`))
      }
      console.log("decrypting QR data");
      const decryptedData = decrypt(encryptedQrData);
      console.log("decryptedData", decryptedData);
      const { ticketQrId, eventId } = decryptedData;
      console.log("ticketQrId", ticketQrId);
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