import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import {  S3toDB, S3toDBSchema } from 'src/forms/schema.schema';
import { S3 } from 'aws-sdk';
import { MongooseModule } from '@nestjs/mongoose';
import { S3Controller } from './s3.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[
  MongooseModule.forFeature([{name: S3toDB.name, schema: S3toDBSchema}]),
  ConfigModule.forRoot({
    cache: true,
    isGlobal: true,
  }),
],
  controllers: [ S3Controller],
  providers: [S3Service]
})
export class S3Module {}
