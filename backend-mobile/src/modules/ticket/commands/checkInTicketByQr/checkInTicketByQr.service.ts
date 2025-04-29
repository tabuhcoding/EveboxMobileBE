import { Injectable } from "@nestjs/common";
import { Result, Ok, Err } from "oxide.ts";
import { CheckInTicketByQrRepository } from "../../repositories/checkInTicketByQr.repository";
import { CheckInTicketByQrResponse } from "./checkInTicketByQr-response.dto";

@Injectable()
export class CheckInTicketByQrService {
  constructor(private readonly checkInTicketByQrRepository: CheckInTicketByQrRepository) {}

  async execute(encryptedQrData: string, email: string): Promise<Result<CheckInTicketByQrResponse, Error>> {
    try {
      const result = await this.checkInTicketByQrRepository.checkInByQr(encryptedQrData, email);
      if (result.isErr()) {
        return Err(new Error(result.unwrapErr().message));
      }

      return Ok(result.unwrap());
    } catch (error) {
      console.error(error);
      return Err(new Error('Failed to check in ticket by QR'));
    }
  }
}