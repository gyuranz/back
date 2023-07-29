import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { OcrService } from './ocr.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ ConfigModule.forRoot({
    cache: true,
  })],
  controllers: [RoomController],
  providers: [OcrService],
})
export class RoomModule {}
