import { Injectable } from "@nestjs/common";
import { Result, Ok, Err } from "oxide.ts";
import { GetUserTicketRepository } from "../../repositories/getUserTicket.repository";
import { UserTicketDto } from "./getUserTicket-response.dto";

@Injectable()
export class GetUserTicketService {
  constructor(
    private getUserTicketRepository: GetUserTicketRepository,
  ) {}
  async execute(email: string): Promise<Result<UserTicketDto[], Error>> {
    try {
      const userTickets = await this.getUserTicketRepository.getUserTicket(email);
      if (!userTickets) {
        return Err(new Error('User ticket not found.'));
      }
      return Ok(userTickets);
    } catch (error) {
      console.error(error);
      return Err(new Error('Failed to select seat'));
    }
  }
}