import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
  
  @Controller('upload')
  export class S3Controller {
    constructor(
      private awsS3Service: S3Service,
    ) {}

    @Post('')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
      const imageUrl = await this.awsS3Service.uploadFileToS3(file);
      const savedImage = await this.awsS3Service.create(imageUrl);

      return savedImage;
    }
  }