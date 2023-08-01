import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OcrService } from './ocr.service';
import { RoomService } from './room.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';

@Controller('room')
export class RoomController {
  constructor(
    private gptService: GptService,
    private readonly roomService: RoomService,
    private readonly s3Service: S3Service,
  ) { }

  @Post(`:room_id/upload`)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Param('room_id') room_id: string, @Body() user_nickname:string) {
    console.log(room_id, "방");
    let base_prompt = `You are teacher who teach students\nSummurize following contents in Korean in 10 lines\nRule1: All sentences must end with a period like this -> Amazon S3는 블록 수준의 영구 스토리지이다.\n`;
    console.log('summary test');
    // 스터디, 회의 중에 DB에 저장된 STT를 찾아서 발표 종료 버튼을 누르면, prompt로 ChatGPT에 보낸 후, 
    // 다시 ChatGPT에서 prompt 관련된 요청을 처리하는 로직

    // DB에서 스터디, 회의 내용을 불러옴(stt_message)
    const { prompt, imgUrl } = await this.gptService.findChatLogFromDBforSummary(room_id);
    // console.log(imgUrls);
    let merged_prompt = base_prompt + prompt;
    console.log(merged_prompt)
    const result = await this.gptService.generateText(merged_prompt);
    const parseresult = result.split(".");
    console.log(parseresult);
    const saveSummary= await this.s3Service.createtoSummaryModel(parseresult, imgUrl, user_nickname, room_id);

    //ChatModel에 이미지 메타데이터 넣기.
    const savedImage = await this.s3Service.createtoChatModel(imgUrl, room_id);
    //S3에 새로운 이미지 업로드
    await this.s3Service.uploadFileToS3(file);
    console.log(savedImage)
    return savedImage;
  }

  @Post(':room_id/summary') // 미완성임 대거 수정해야함
  async findFromDBAndGetSummary(@Param('room_id') room_id: string ,@Body() user_nickname:string) {
  const summaryfromDB = this.roomService.findFromDBAndGetSummary(room_id,user_nickname);
  console.log(summaryfromDB);
  }

  @Get(':room_id/quiz')
  async findFromDBAndMakeQuiz(@Param('room_id') room_id: string): Promise<{ result: string }> {
    console.log('Quiz Test');
    let base_prompt = `Please make 10 O/X quizzes in Korean according to the following contents\nRule1:When making a quiz, the O X ratio must be 50% each.\nRule2: Don't make duplicate quizzes\nRule3: following this format strictly -> 퀴즈 1: Amazon S3는 블록 수준의 영구 스토리지이다. 답: X\n`;
    const { prompt } = await this.gptService.findFromDB(room_id);
    let merged_prompt = `${base_prompt} ${prompt}`;
    console.log(merged_prompt);
    const result = await this.gptService.generateText(merged_prompt);
    return { result };
  }

  @Post(':room_id/question')
  async findFromDBAndAnswerQuestion(@Param('room_id') room_id: string, @Body() userRequest: string): Promise<{ result: string }> {
    let base_prompt = `${userRequest}\nPlease answer this request in Korean correctly based on following contents\n`;
    console.log('question test');
    const { prompt } = await this.gptService.findFromDB(room_id);
    let merged_prompt = `${base_prompt} ${prompt}`;
    console.log(merged_prompt);
    const result = await this.gptService.generateText(merged_prompt);
    return { result };
  }

  @Get('/api/:roomId')
  async checkRoomExists(@Param() { room_id }) {
    console.log(room_id);
    const roomExists = await this.roomService.checkRoomExists(room_id);
    console.log(roomExists);
    if (roomExists) {
      const isFull = await this.roomService.isRoomFull(room_id);
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
