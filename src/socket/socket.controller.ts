import { Controller, Get } from '@nestjs/common';
import { TwilioService } from './twilio.service';

@Controller('get-turn-credentials')
export class TurnController {
  constructor(private readonly twilioService: TwilioService) {}

  @Get()
  async getTurnCredentials() {
    try {
      const token = await this.twilioService.generateToken();
      return { token };
    } catch (err) {
      console.log('Error occurred when fetching turn server credentials');
      console.log(err);
      return { token: null };
    }
  }
}