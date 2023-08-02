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
  // async uploadFile(@UploadedFile() file: Express.Multer.File, @Param('room_id') room_id: string, @Body() userNickname:{user_nickname:string}) {
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Param('room_id') room_id: string) {
    let base_prompt = `You are teacher who teach students\nSummurize following contents in Korean in 10 lines\nRule1: All sentences must end with a period like this -> Amazon S3는 블록 수준의 영구 스토리지이다.\n`;
    console.log('upload and summary test');
    // 기존의 채팅내용과 imgUrl 불러옴
    const { prompt, imgUrl } = await this.gptService.findChatLogFromDBforSummary(room_id);
    let merged_prompt = base_prompt + prompt;
    console.log(merged_prompt)
    const result = await this.gptService.generateText(merged_prompt);
    const parseresult = result.split(".");
    console.log(parseresult);
    // user_nickname은 서버에서 따로 받아옴, room_id로 room_joined_user_list의 user_nickname에 대해 Summary에 넣음
    const user_nicknames = await this.s3Service.findFromRoomModel(room_id);

    for (const user_nickname of user_nicknames) {
      const saveSummary = await this.s3Service.createtoSummaryModel(parseresult, imgUrl, user_nickname, room_id);
    }
    //ChatModel에 이미지 메타데이터 넣기.
    const savedImage = await this.s3Service.createtoChatModel(room_id);
    const img_metadata = savedImage.img_metadata;

    //S3에 새로운 이미지 업로드
    console.log(file);
    await this.s3Service.uploadFileToS3(file, img_metadata);
    console.log(savedImage);
    return savedImage;
  }

  @Get(`:room_id/finished`)
  async studyFinishLetsSummary(@Param('room_id') room_id: string) {
    let base_prompt = `You are teacher who teach students\nSummurize following contents in Korean in 10 lines\nRule1: All sentences must end with a period like this -> Amazon S3는 블록 수준의 영구 스토리지이다.\n`;
    console.log('upload and summary test');
    // 기존의 채팅내용과 imgUrl 불러옴
    const { prompt, imgUrl } = await this.gptService.findChatLogFromDBforSummary(room_id);
    let merged_prompt = base_prompt + prompt;
    console.log(merged_prompt)
    const result = await this.gptService.generateText(merged_prompt);
    const parseresult = result.split(".");
    console.log(parseresult);
    // user_nickname은 서버에서 따로 받아옴, room_id로 room_joined_user_list의 user_nickname에 대해 Summary에 넣음
    const user_nicknames = await this.s3Service.findFromRoomModel(room_id);

    for (const user_nickname of user_nicknames) {
      await this.s3Service.createtoSummaryModel(parseresult, imgUrl, user_nickname, room_id);
    }
  }

  @Post(':room_id/summary')
  async findFromDBAndGetSummary(@Param('room_id') room_id: string, @Body() userNickname: { user_nickname: string }) {
    const { user_nickname } = userNickname;
    const summaryfromDB = await this.roomService.findFromDBAndGetSummary(room_id, user_nickname);
    console.log(summaryfromDB);
    return { summaryfromDB };
  }

  @Get(':room_id/quiz')
  async findFromDBAndMakeQuiz(@Param('room_id') room_id: string): Promise<{ parseresult: string[] }> {
    console.log('Quiz Test');
    let base_prompt = `Please make 10 O/X quizzes in Korean according to the following contents\nRule1:When making a quiz, the O X ratio must be 50% each.\nRule2: Don't make duplicate quizzes\nRule3: following this format strictly -> 퀴즈 1: Amazon S3는 블록 수준의 영구 스토리지이다. 답: X.`;
    const { prompt } = await this.gptService.findFromDB(room_id);
    let merged_prompt = `${base_prompt} ${prompt}`;
    console.log(merged_prompt);
    const result = await this.gptService.generateText(merged_prompt);
    const parseresult = result.split(/[.\n]/);
    return { parseresult };
  }

  @Post(':room_id/question')
  async findFromDBAndAnswerQuestion(@Param('room_id') room_id: string, @Body() userRequest: { user_request: string }): Promise<{ result: string }> {
    const { user_request } = userRequest;
    console.log(user_request);
    let base_prompt = `${user_request}\nPlease answer this request in Korean correctly based on following contents\n`;
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
