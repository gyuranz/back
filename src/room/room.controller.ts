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
    console.log('upload and summary test');
    let gpt_role = `You are the one who summarizes the content. Summarizes following contents in Korean.
                    Instructions:
                    - All sentences must end with a period like this -> 나는 바나나를 좋아한다.
                    - Eliminate unnecessary sentences when summarizing.
                    - The summary should not exceed 10 sentences.
                    - Summarization should complete within 10 seconds.`;
    // 기존의 채팅내용과 imgUrl 불러옴
    let { prompt } = await this.gptService.findChatLogFromDBforSummary(room_id);
    // let merged_prompt = base_prompt + prompt;
    console.log(prompt);
    const result = await this.gptService.generateText(gpt_role,prompt);
    const parseresult = result.split(".");
    // user_nickname은 서버에서 따로 받아옴, room_id로 room_joined_user_list의 user_nickname에 대해 Summary에 넣음
    const user_nicknames = await this.s3Service.findFromRoomModel(room_id);
    const savedImage = await this.s3Service.createtoChatModel(room_id);
    for (const user_nickname of user_nicknames) {
      await this.s3Service.createtoSummaryModel(parseresult, savedImage.img_metadata, user_nickname, room_id); //! await 삭제
    }
    //S3에 새로운 이미지 업로드
    await this.s3Service.uploadFileToS3(file, savedImage.img_metadata); //! await 삭제
    console.log('S3 upload Complite!')
  }

  @Get(`:room_id/finished`)
  async studyFinishLetsSummary(@Param('room_id') room_id: string) {
    console.log('upload and summary test');
    let gpt_role = `You are the one who summarizes the content. Summarizes following contents in Korean.
                    Instructions:
                    - All sentences must end with a period like this example -> 나는 바나나를 좋아한다.
                    - Eliminate unnecessary sentences when summarizing.
                    - The summary should not exceed 10 sentences.
                    - Summarization should be completed within 10 seconds.`;
    // 기존의 채팅내용과 imgUrl 불러옴
    const { prompt, imgUrl } = await this.gptService.findChatLogFromDBforSummary(room_id);
    // let merged_prompt = base_prompt + prompt;
    console.log(prompt)
    const result = await this.gptService.generateText(gpt_role,prompt);
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
    console.log(user_nickname);
    const summaryfromDB = await this.roomService.findFromDBAndGetSummary(room_id, user_nickname);
    console.log(summaryfromDB);
    return { summaryfromDB };
  }

  @Get(':room_id/quiz')
  async findFromDBAndMakeQuiz(
    @Param('room_id') room_id: string,
  ): Promise<{ result: string }> {
    console.log('Quiz Test');
    let gpt_roll= `You are the one who gives the O/X quiz. Make 10 O/X quizzes in Korean according to the following contents.
                   Instructions:
                   - Don't make duplicate quizzes. 
                   - following this example format strictly -> 퀴즈 1: 사자는 포유류에 속한다. 답: O.
                   - Don't use example as quiz.
                   - When creating a quiz set, the ratio of correct and incorrect answers in the quiz should be 50%.
                   - Don't give extra explanation of answer
                   - Process should be completed in 10 seconds.`;
    // let merged_prompt = `${base_prompt} ${prompt}`;
    // console.log(merged_prompt);
    let { prompt } = await this.gptService.findFromDB(room_id);
    console.log(prompt);
    // let new_prompt = `Plesase make 10 O/X quizzes in Korean according to the following contents : (${prompt})`
    // console.log(new_prompt);
    
    const result = await this.gptService.generateText(gpt_roll,prompt);
    return { result };
  }

  
  @Post(':room_id/question')
  async findFromDBAndAnswerQuestion(@Param('room_id') room_id: string, @Body() userRequest: {user_request:string}){
    const {user_request} = userRequest;
    console.log(user_request);
    // : { user_request: string }
    // const { user_request } = userRequest;
    // console.log(user_request);
    console.log('question test');
    // console.log(user_request);
    let gpt_roll=`You are the one responsing to request. answer this request(${user_request}) in Korean correctly based on following contents.
                  Instructions:
                  - The answer must be completed within 5 seconds.
                  - The answer must be 3 sentences or less.
                  - If you're unsure of an answer, you can say "잘 모르겠습니다." or "확실하지 않습니다." `;
    let { prompt } = await this.gptService.findFromDB(room_id);
    // prompt = `Please answer this request in Korean correctly based on following contents: ${prompt}`;
    // let merged_prompt = `${base_prompt} ${prompt}`;
    // let new_prompt = `${user_request} ${prompt}`;
    console.log(gpt_roll);
    console.log(prompt);
    const result = await this.gptService.generateText(gpt_roll, prompt);
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
