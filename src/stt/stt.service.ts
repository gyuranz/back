import { Injectable } from '@nestjs/common';
import { SpeechClient } from '@google-cloud/speech';
import { ConfigService } from '@nestjs/config';
import { Chat } from 'src/forms/schema.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Injectable()
export class SttService {
  speechClient: SpeechClient;
  
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    ) {
    this.speechClient = new SpeechClient({
      projectId : this.configService.get<string>('googleCloudConfig.projectId'),
      keyFilename: this.configService.get<string>('googleCloudConfig.keyFilename'),
    });
  }

  createMessagetoChat(stt: string): Promise<Chat> {
    return this.chatModel.create(stt);
  }
}