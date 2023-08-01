import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import {  Chat, ChatSchema } from 'src/forms/schema.schema';
import { S3 } from 'aws-sdk';
import { MongooseModule } from '@nestjs/mongoose';
import { S3Controller } from './s3.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[
  MongooseModule.forFeature([{name: Chat.name, schema: ChatSchema}]),
  ConfigModule.forRoot({
    cache: true,
    isGlobal: true,
  }),
],
  controllers: [ S3Controller],
  providers: [S3Service]
})
export class S3Module {}