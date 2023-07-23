// src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SttGateway } from './stt.gateway';
import { SttService } from './stt.service';
import googleCloudConfig from './google-cloud.config';

@Module({
  imports: [ConfigModule.forRoot({
    load: [googleCloudConfig]
  })],
  providers: [SttGateway, SttService],
})
export class SttModule {}
