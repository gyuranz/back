import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioService {
    private readonly accountSid = 'AC2cdb76fd55274a0c9181d8320f0a061e';
    private readonly authToken = '83db818ae43ff3ad9f5b25c77deccafc';
    private readonly twilioClient: Twilio;

    constructor() {
        this.twilioClient = new Twilio(this.accountSid, this.authToken);
    }

    async generateToken(): Promise<any> {
        try {
            const token = await this.twilioClient.tokens.create();
            return token;
        } catch (err) {
            console.log('Error occurred when fetching turn server credentials');
            console.log(err);
            return null;
        }
    }
}