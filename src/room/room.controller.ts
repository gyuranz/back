import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OcrService } from './ocr.service';

@Controller('room')
export class RoomController {
    constructor(
        private gptService:GptService,
        private readonly ocrService: OcrService
        ){}
    @Get(':room_id/summary') // 미완성임 대거 수정해야함
    async findFromDB(@Param('room_id') roomId: string) {
        let base_prompt = `You are teacher who teach students\nSummurize following contents in Korean in 10 lines\n`;
        console.log('summary test');
        // 스터디, 회의 중에 DB에 저장된 STT를 찾아서 발표 종료 버튼을 누르면, prompt로 ChatGPT에 보낸 후, 
        // 다시 ChatGPT에서 prompt 관련된 요청을 처리하는 로직

        // DB에서 스터디, 회의 내용을 불러옴(stt_message)
        const { prompt, imgUrls } = await this.gptService.findFromDB(roomId);
        // console.log(imgUrls);
        let merged_prompt = base_prompt + prompt;
        console.log(merged_prompt);
        return await this.gptService.generateText(merged_prompt);
    }
    @Get(':room_id/quiz')
    async findFromDBAndMakeQuiz(@Param('room_id') roomId: string): Promise<{result: string}> {
        console.log('Quiz Test');
        let base_prompt = `Please make 10 O/X quizzes in Korean according to the following contents\nRule1:When making a quiz, the O X ratio must be 50% each.\nRule2: Don't make duplicate quizzes\nRule3: following this format strictly -> 퀴즈 1: Amazon S3는 블록 수준의 영구 스토리지이다. 답: X\n`;
        const {prompt, imgUrls} = await this.gptService.findFromDB(roomId);
        let merged_prompt = `${base_prompt} ${prompt}`;
        console.log(merged_prompt);
        const result = await this.gptService.generateText(merged_prompt);
        return {result};
    }
    @Post(':room_id/question')
    async findFromDBAndAnswerQuestion(@Param('room_id') roomId: string, @Body() userRequest: string): Promise<{result: string}> {
        let base_prompt = `${userRequest}\nPlease answer this request in Korean correctly based on following contents\n`; 
        console.log('question test');
        const {prompt, imgUrls} = await this.gptService.findFromDB(roomId);
        let merged_prompt = `${base_prompt} ${prompt}`;
        console.log(merged_prompt);
        const result = await this.gptService.generateText(merged_prompt);
        return {result};
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