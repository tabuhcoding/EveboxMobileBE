import { Injectable } from '@nestjs/common';
import { Err, Result } from 'oxide.ts';
import { GetEventOfOrgRepository } from '../../repositories/getEventOfOrg.repository';
import { EventOrgFrontDisplayDto } from './getEventOfOrg-response.dto';

@Injectable()
export class GetEventOfOrgService {
  constructor(private readonly getEventOfOrgRepository: GetEventOfOrgRepository) {}

  async findAll(organizerId: string): Promise<Result<EventOrgFrontDisplayDto[], Error>> {
    try{
      if (!organizerId) {
        return Err(new Error('Organizer ID is required'));
      }
      return await this.getEventOfOrgRepository.findAll(organizerId);
    } catch (error) {
      return Err(new Error('Failed to retrieve events'));
    }
  }
}
