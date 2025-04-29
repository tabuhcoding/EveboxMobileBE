import { Injectable } from "@nestjs/common";
import { Result, Ok, Err } from "oxide.ts";
import { CheckInTicketRepository } from "../../repositories/checkInTicket.repository";
import { CheckInTicketResponseData } from "./checkInTicket-response.dto";

@Injectable()
export class CheckInTicketService {
  constructor(private readonly CheckInTicketRepository: CheckInTicketRepository) {}

  async execute(id: string, email: string, eventId: number): Promise<Result<CheckInTicketResponseData, Error>> {
    try {
      const result = await this.CheckInTicketRepository.checkInTicket(id, email, eventId);
      if (result.isErr()) {
        return Err(new Error(result.unwrapErr().message));
      }

      return Ok(result.unwrap());
    } catch (error) {
      console.error(error);
      return Err(new Error('Failed to check in ticket'));
    }
  }
}