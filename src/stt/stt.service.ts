// src/app.service.ts

import { Injectable } from '@nestjs/common';
import { SpeechClient } from '@google-cloud/speech';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

@Injectable()
export class SttService {
  // private speechClient: SpeechClient;
  speechClient: SpeechClient;
  
  constructor(private readonly configService: ConfigService) {
    this.speechClient = new SpeechClient({
      // credentials: this.configService.get('googleCloudConfig'),
      projectId : this.configService.get<string>('googleCloudConfig.projectId'),
      keyFilename: this.configService.get<string>('googleCloudConfig.keyFilename'),
    });
  }
}
