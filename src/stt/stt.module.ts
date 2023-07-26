import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SttGateway } from './stt.gateway';
import { SttService } from './stt.service';
import googleCloudConfig from './google-cloud.config';
// 동윤
import { MongooseModule } from '@nestjs/mongoose';
import { Ppt, PptSchema, STT, STTSchema, Summ, SummSchema } from 'src/forms/schema.schema';
import { GptService } from 'src/room/gpt.service';

@Module({
  imports: [
    // 동윤
    MongooseModule.forFeature([{name: STT.name, schema: STTSchema}]),
    MongooseModule.forFeature([{name: Ppt.name, schema: PptSchema}]),
    MongooseModule.forFeature([{ name: Summ.name, schema: SummSchema }]),
    ConfigModule.forRoot({
    load: [googleCloudConfig]
    
  })],
  providers: [SttGateway, SttService, GptService],
})
export class SttModule {}