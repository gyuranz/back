import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioService {
  private readonly accountSid = process.env.TWILO_ACCOUNT_SID;
  private readonly authToken = process.env.TWILO_AUTH_TOKEN;
  private readonly twilioClient: Twilio;

  constructor() {
    this.twilioClient = new Twilio(this.accountSid, this.authToken);
  }

  async generateToken(): Promise<any> {
    try {
      const token = await this.twilioClient.tokens.create();
      console.log('b');
      return token;
    } catch (err) {
      console.log('Error occurred when fetching turn server credentials');
      console.log(err);
      return null;
    }
  }
}
