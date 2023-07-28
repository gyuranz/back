import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SttGateway } from './stt.gateway';
import { SttService } from './stt.service';
import googleCloudConfig from './google-cloud.config';
// 동윤
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema, Ppt, PptSchema, STT, STTSchema } from 'src/forms/schema.schema';

@Module({
  imports: [
    // 동윤
    MongooseModule.forFeature([{name: STT.name, schema: STTSchema}]),
    MongooseModule.forFeature([{name: Ppt.name, schema: PptSchema}]),
    MongooseModule.forFeature([{name: Chat.name, schema: ChatSchema}]),
    ConfigModule.forRoot({
    load: [googleCloudConfig]
  })],
  providers: [SttGateway, SttService],
})
export class SttModule {}