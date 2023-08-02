import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { GptService } from './gpt.service';
import { Chat, ChatSchema, Room, RoomSchema, Summary, SummarySchema, User, UserSchema } from 'src/forms/schema.schema';
import { OcrService } from './ocr.service';
import { RoomService } from './room.service';
import { S3Service } from './s3.service';
import { FindService } from 'src/auth/find.service';

@Module({
    imports: [
        MongooseModule.forFeature([{name:Chat.name, schema:ChatSchema},
            {name:Summary.name, schema:SummarySchema},
            {name:User.name, schema:UserSchema},
            {name:Room.name, schema:RoomSchema}]),
        ConfigModule.forRoot({
            cache: true,
            isGlobal: true,
          }),
    ],
    controllers: [RoomController],
    providers:[GptService, OcrService, RoomService, S3Service, FindService],
})
export class RoomModule { }


