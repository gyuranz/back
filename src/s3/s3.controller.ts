import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';

@Controller('room')
export class S3Controller {
  constructor(
    private awsS3Service: S3Service,
  ) {}

  @Post(`:room_id/upload`)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File ,@Param('room_id') room_id:string ) {
    console.log('돼라')
    const imageUrl = await this.awsS3Service.uploadFileToS3(file);

    const savedImage = await this.awsS3Service.create(imageUrl, room_id);
    console.log(savedImage)
    return savedImage;
  }
}