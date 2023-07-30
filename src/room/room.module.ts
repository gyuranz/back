import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { GptService } from './gpt.service';
import { Chat, ChatSchema, Summ, SummSchema } from 'src/forms/schema.schema';
import { OcrService } from './ocr.service';
import { RoomService } from './room.service';

@Module({
    imports: [
        MongooseModule.forFeature([{name:Chat.name, schema:ChatSchema},{name:Summ.name, schema:SummSchema}]),
        ConfigModule.forRoot({
            cache: true,
            isGlobal: true,
          }),
    ],
    controllers: [RoomController],
    providers:[GptService, OcrService, RoomService],
})
export class RoomModule { }


