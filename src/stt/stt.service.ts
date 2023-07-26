import { Injectable } from '@nestjs/common';
import { SpeechClient } from '@google-cloud/speech';
import { ConfigService } from '@nestjs/config';
import { Ppt, STT, STTSchema } from 'src/forms/schema.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Readable } from 'stream';
import { Model } from 'mongoose';


@Injectable()
export class SttService {
  speechClient: SpeechClient;
  
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(STT.name) private sttModel: Model<STT>,
    @InjectModel(Ppt.name) private pptModel: Model<Ppt>
    ) {
    this.speechClient = new SpeechClient({
      projectId : this.configService.get<string>('googleCloudConfig.projectId'),
      keyFilename: this.configService.get<string>('googleCloudConfig.keyFilename'),
    });
  }

  /**
  * 메시지를 저장해주는 함수. (string만 들어올 수 있음)*/
  createMessage(stt: string): Promise<STT> {
    return this.sttModel.create(stt);
  }
  createMessagetoPpt(stt: string): Promise<Ppt> {
    return this.pptModel.create(stt);
  }
}