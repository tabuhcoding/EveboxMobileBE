import { Module } from "@nestjs/common";

import { CheckInTicketController } from "./commands/checkInTicket/checkInTicket.controller";
import { CheckInTicketService } from "./commands/checkInTicket/checkInTicket.service";
import { CheckInTicketRepository } from "./repositories/checkInTicket.repository";
import { CheckInTicketByQrController } from "./commands/checkInTicketByQr/checkInTicketByQr.controller";
import { CheckInTicketByQrService } from "./commands/checkInTicketByQr/checkInTicketByQr.service";
import { CheckInTicketByQrRepository } from "./repositories/checkInTicketByQr.repository";
import { GetCheckedInTicketsController } from "./queries/getCheckedInTickets/getCheckedInTickets.controller";
import { GetCheckedInTicketsService } from "./queries/getCheckedInTickets/getCheckedInTickets.service";
import { GetCheckedInTicketsRepository } from "./repositories/getCheckedInTickets.repository";
import { GetUserTicketController } from './queries/getUserTicket/getUserTicket.controller';
import { GetUserTicketService } from "./queries/getUserTicket/getUserTicket.service";
import { GetUserTicketRepository } from "./repositories/getUserTicket.repository";

@Module({
  controllers: [
    CheckInTicketController,
    CheckInTicketByQrController,
    GetCheckedInTicketsController,
    GetUserTicketController,
  ],
  providers: [
    CheckInTicketService,
    CheckInTicketRepository,

    CheckInTicketByQrService,
    CheckInTicketByQrRepository,

    GetCheckedInTicketsService,
    GetCheckedInTicketsRepository,

    GetUserTicketService,
    GetUserTicketRepository,
  ]
})

export class TicketModule {}