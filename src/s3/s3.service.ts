import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { S3 } from 'aws-sdk';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private s3: S3;

  constructor(    
    @InjectModel(S3.name) private imageModel: Model<S3>
    ) {
    this.s3 = new S3({
        accessKeyId: 'AKIARJ56LJIZMWXVME5O',
        secretAccessKey: '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'
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

  async create(imageUrl: string): Promise<S3> {
      const createdImage = new this.imageModel({ imageUrl });
    return createdImage.save();
  }
}