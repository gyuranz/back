import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { Chat, Summary, Room } from 'src/forms/schema.schema';

@Injectable()
export class S3Service {
  private s3: S3;

  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(Summary.name) private summaryModel: Model<Summary>,
    @InjectModel(Room.name) private roomModel: Model<Room>,
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

  async findFromRoomModel(room_id:string) {
    console.log('RoomDB searching');
    const userNicknames = await this.roomModel.find({room_id:room_id})
      .select({room_user_joined_list:1})[0]
      .map(user => user.user_nickname);
      return userNicknames.flat();

  }


//   async findChatLogFromDBforSummary(roomId: string) {
//     console.log('DB searching');
//     let promptstack = [];
//     let prompt = "";
//     let imgUrl = "";

//     const result = await this.chatModel.find({ room_id: roomId })
//         .sort({ chat_creatAt: -1 })
//         .select({ message: 1, img_metadata: 1 });
//     for (const data of result) {
//         if (data.message) {
//             promptstack.push(`${data.message}\n`);
//         } else if (data.img_metadata) {
//             imgUrl = `https://aitolearn.s3.ap-northeast-2.amazonaws.com/${data.img_metadata}\n`;
//             // prompt += imgUrl;
//             promptstack.push(await this.ocrService.textExtractionFromImage(imgUrl));
//             break;
//         }
//     }
//     console.log(promptstack);
//     for (var i = promptstack.length - 1; i >= 0; i--) {
//         prompt += promptstack[i]
//     }
//     return { prompt, imgUrl };
// }
}