import { Controller, Get } from '@nestjs/common';
import { GptService } from './gpt.service';

@Controller('room')
export class RoomController {
    constructor(private gptService:GptService){}
    @Get('sum')
    async findFromDB() {
        // 스터디, 회의 중에 DB에 저장된 STT를 찾아서 발표 종료 버튼을 누르면, prompt로 ChatGPT에 보낸 후, 
        // 다시 ChatGPT에서 prompt 관련된 요청을 처리하는 로직

        // DB에서 스터디, 회의 내용을 불러옴(stt_message)
        const prompt = await this.gptService.findFromDB();
        // prompt(stt_message를 전부 합침)를 GPT에 보내서, 그 결과를 반환
        return await this.gptService.generateText(prompt);
    }

    @Get(':room_id/summary')
    async findSummary(){
        const summary = await this.gptService.findFromSummaryDB();
    }
}
