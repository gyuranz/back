import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { Chat, Summary } from 'src/forms/schema.schema';

@Injectable()
export class S3Service {
  private s3: S3;

  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(Summary.name) private summaryModel: Model<Summary>,
    private configService: ConfigService
  ) {
    this.s3 = new S3({
      credentials: {
        accessKeyId: this.configService.get<string>(`AWS_ACCESS_KEY_ID`),
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });
  }

  async uploadFileToS3(file: Express.Multer.File): Promise<string> {
    const key = `${uuidv4()}-${file.originalname}`;
    const params = {
      Bucket: 'aitolearn',
      Key: key,
      Body: file.buffer,
    };

    await this.s3.upload(params).promise();
    return key;
  }

  async consoleKey(){
    console.log(this.configService.get<string>(`AWS_ACCESS_KEY_ID`));
    console.log(process.env.AWS_SECRET_ACCESS_KEY);
  }
  
  async createtoChatModel(img_metadata: string, room_id): Promise<Chat> {
    const createdImage = new this.chatModel({ img_metadata , room_id});
    return createdImage.save();
  }
  async createtoSummaryModel(parseresult:string[], imgUrl:string, user_nickname:string, room_id): Promise<Summary> {
    const createdImage = new this.summaryModel({message_summary:parseresult , img_url:imgUrl, user_nickname:user_nickname, room_id:room_id});
    return createdImage.save();
  }
}