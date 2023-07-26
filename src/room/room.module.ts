import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ppt, PptSchema, STT, STTSchema } from 'src/forms/schema.schema';
import { ConfigModule } from '@nestjs/config';
import { GptService } from './gpt.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Ppt.name, schema: PptSchema }]),
        ConfigModule.forRoot({
            cache: true,
            isGlobal: true,
          }),
    ],
    controllers: [RoomController],
    providers:[GptService],
})
export class RoomModule { }


