// src/app.service.ts

import { Injectable } from '@nestjs/common';
import { SpeechClient } from '@google-cloud/speech';
import { ConfigService } from '@nestjs/config';
import { STT, STTSchema } from 'src/forms/schema.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Readable } from 'stream';
import { Model } from 'mongoose';

@Injectable()
export class SttService {

  // private speechClient: SpeechClient;
  speechClient: SpeechClient;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(STT.name) private sttModel: Model<STT>
  ) {
    this.speechClient = new SpeechClient({
      // credentials: this.configService.get('googleCloudConfig'),
      projectId: this.configService.get<string>('googleCloudConfig.projectId'),
      keyFilename: this.configService.get<string>('googleCloudConfig.keyFilename'),
    });
  }

  /**
  * 메시지를 저장해주는 함수. (string만 들어올 수 있음)*/
  createMessage(stt): Promise<STT> {
    return this.sttModel.create(stt);
  }
}
