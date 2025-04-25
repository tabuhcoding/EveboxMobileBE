import { Module } from "@nestjs/common";

import { GetUserTicketController } from './queries/getUserTicket/getUserTicket.controller';
import { GetUserTicketService } from "./queries/getUserTicket/getUserTicket.service";
import { GetUserTicketRepository } from "./repositories/getUserTicket.repository";

@Module({
  controllers: [
    GetUserTicketController,
  ],
  providers: [
    GetUserTicketService,
    GetUserTicketRepository,
  ]
})

export class TicketModule {}