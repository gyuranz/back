import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Schema } from 'src/forms/schema.schema';
import { S3 } from 'aws-sdk';
import { MongooseModule } from '@nestjs/mongoose';
import { S3Controller } from './s3.controller';

@Module({
  imports:[MongooseModule.forFeature([{name: S3.name, schema: S3Schema}]),],
  controllers: [ S3Controller],
  providers: [S3Service]
})
export class S3Module {}
