import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { GptService } from './gpt.service';
import { Chat, ChatSchema } from 'src/forms/schema.schema';
import { OcrService } from './ocr.service';

@Module({
    imports: [
        MongooseModule.forFeature([{name:Chat.name, schema:ChatSchema}]),
        ConfigModule.forRoot({
            cache: true,
            isGlobal: true,
          }),
    ],
    controllers: [RoomController],
    providers:[GptService, OcrService],
})
export class RoomModule { }


