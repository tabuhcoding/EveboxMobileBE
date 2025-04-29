import { Injectable } from "@nestjs/common";
import { Result, Ok, Err } from "oxide.ts";
import { GetCheckedInTicketsRepository } from "../../repositories/getCheckedInTickets.repository";
import { CheckedInTicketsData } from "./getCheckedInTickets-response.dto";

@Injectable()
export class GetCheckedInTicketsService {
  constructor(private readonly getCheckedInTicketsRepository: GetCheckedInTicketsRepository) {}

  async execute(showingId: string, email: string): Promise<Result<CheckedInTicketsData[], Error>> {
    try {
      if (!showingId) {
        return Err(new Error('No showing id in query'));
      }

      const tickets = await this.getCheckedInTicketsRepository.getCheckedInTickets(showingId, email);

      if (tickets.isErr()) {
        return Err(new Error(tickets.unwrapErr().message));
      }

      return Ok(tickets.unwrap());
    } catch (error) {
      console.log(error);
      return Err(new Error(`Failed to get checked-in tickets of showing ${showingId}`));
    }
  }
}