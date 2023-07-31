import { Body, Controller, Get, Param } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OcrService } from './ocr.service';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(
    private gptService: GptService,
    private readonly roomService: RoomService,
  ) {}
  @Get(`:room_id/summary`)
  async findFromDB() {
    console.log('도착1');
    // 스터디, 회의 중에 DB에 저장된 STT를 찾아서 발표 종료 버튼을 누르면, prompt로 ChatGPT에 보낸 후,
    // 다시 ChatGPT에서 prompt 관련된 요청을 처리하는 로직

    // DB에서 스터디, 회의 내용을 불러옴(stt_message)
    const prompt = await this.gptService.findFromDB();
    // prompt(stt_message를 전부 합침)를 GPT에 보내서, 그 결과를 반환
    return await this.gptService.generateText(prompt);
  }

  @Get('/api/:roomId')
  async checkRoomExists(@Param() { roomId }) {
    console.log(roomId);
    const roomExists = await this.roomService.checkRoomExists(roomId);
    console.log(roomExists);
    if (roomExists) {
      const isFull = await this.roomService.isRoomFull(roomId);
      return { roomExists: true, full: isFull };
    } else {
      return { roomExists: false };
    }
  }
  // @Get(`:room_id/summary`)
  // textExtraction() {
  //   return this.ocrService.textExtractionFromImage();
  // }

  // @Get(`:room_id/summary`)
  // async findSummary(){
  //     console.log('summary');
  //     const summary = await this.gptService.findFromSummaryDB();
  //     return summary;
  // }
}
