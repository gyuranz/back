import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ppt, PptSchema, STT, STTSchema, Summ, SummSchema } from 'src/forms/schema.schema';
import { ConfigModule } from '@nestjs/config';
import { GptService } from './gpt.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Ppt.name, schema: PptSchema }]),
        MongooseModule.forFeature([{ name: Summ.name, schema: SummSchema }]),
        ConfigModule.forRoot({
            cache: true,
            isGlobal: true,
          }),
    ],
    controllers: [RoomController],
    providers:[GptService],
    exports:[GptService],
})
export class RoomModule { }


