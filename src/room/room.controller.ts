import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OcrService } from './ocr.service';
import { RoomService } from './room.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import { Quiz, SummarySchema } from 'src/forms/schema.schema';

@Controller('room')
export class RoomController {
  constructor(
    private gptService: GptService,
    private readonly roomService: RoomService,
    private readonly s3Service: S3Service,
  ) { }

  @Post(`:room_id/upload`)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Param('room_id') room_id: string) {
    console.log('Summary and Upload start!!');
    const gpt_role = `You are the one who summarizes the content. Summarizes following contents in Korean.
                    Instructions:
                    - All sentences must end with a period like this -> 나는 바나나를 좋아한다.
                    - Eliminate unnecessary sentences when summarizing.
                    - The summary should not exceed 10 sentences.
                    - Summarization should complete within 10 seconds.`;
    // 기존의 채팅내용과 직전 이미지에서 ocr 수행해서 prompt에 붙임
    const { prompt, prevImgUrl } = await this.gptService.findChatLogFromDBforSummary(room_id);
    // console.log('요약할 prompt에는 이전 이미지 OCR 텍스트 추출도 포함되어 있어야함');
    

    // 채팅+직전이미지가 50음절 이상 
    if (prompt.length > 50) {
      console.log('prompt 50음절 넘어서 요약 수행 ing~, S3 upload Complete!까지 기다리셈');
      
      const result = await this.gptService.generateText(gpt_role, prompt);
      const parseresult = result.split(".");

      // user_nickname은 서버에서 따로 받아옴, room_id로 room_joined_user_list의 user_nickname에 대해 Summary에 넣음
      const user_nicknames = await this.s3Service.findFromRoomModel(room_id);
      const savedImage = await this.s3Service.createtoChatModel(room_id);
      parseresult.push(savedImage.img_metadata);
      // console.log(`요약한 내용 및 upload 파일 메타데이터:${parseresult}`);
      console.log('요약 완료~');
      for (const user_nickname of user_nicknames) {
        await this.s3Service.createtoSummaryModel(parseresult, user_nickname, room_id); //! await 삭제
        console.log(`summary_collection의 ${user_nickname}에게 요약 정보 전달`);
      }

      //S3에 새로운 이미지 업로드
      await this.s3Service.uploadFileToS3(file, savedImage.img_metadata); //! await 삭제
      console.log('S3 upload Complete!');
    }

    else {
      console.log('prompt 50음절 안넘어가서 요약 수행 안함~, S3 upload Complete!까지 기다리셈')
      const savedImage = await this.s3Service.createtoChatModel(room_id);

      // 50 음절 안넘어가도 처음 이미지 업로드시에 summary collection에 추가해야 할 경우
      if (prevImgUrl ===""){
        const parseresult = [savedImage.img_metadata];
        const user_nicknames = await this.s3Service.findFromRoomModel(room_id);
        console.log('user_summary에 img_metadata만 추가');
        for (const user_nickname of user_nicknames) {
          await this.s3Service.createtoSummaryModel(parseresult, user_nickname, room_id); //! await 삭제
          console.log(`summary_collection의 ${user_nickname}에게 요약 정보 전달`);

        }
      }
      //S3에 새로운 이미지 업로드
      await this.s3Service.uploadFileToS3(file, savedImage.img_metadata); //! await 삭제
      console.log('S3 upload Complete!');
    }
  }

  @Get(`:room_id/finished`)
  async studyFinishLetsSummary(@Param('room_id') room_id: string) {
    console.log('Summary and Finish start!!');
    const gpt_role = `You are the one who summarizes the content. Summarizes following contents in Korean.
                    Instructions:
                    - All sentences must end with a period like this example -> 나는 바나나를 좋아한다.
                    - Eliminate unnecessary sentences when summarizing.
                    - The summary should not exceed 10 sentences.
                    - Summarization should be completed within 10 seconds.`;
    // 기존의 채팅내용과 imgUrl 불러옴
    const { prompt } = await this.gptService.findChatLogFromDBforSummary(room_id);
    console.log('finish 눌러서 요약 수행 ing~, Finish Complete!까지 기다리셈');
    const result = await this.gptService.generateText(gpt_role, prompt);
    const parseresult = result.split(".");
    console.log('요약 완료~');
    // user_nickname은 서버에서 따로 받아옴, room_id로 room_joined_user_list의 user_nickname에 대해 Summary에 넣음
    const user_nicknames = await this.s3Service.findFromRoomModel(room_id);
    for (const user_nickname of user_nicknames) {
      await this.s3Service.createtoSummaryModel(parseresult, user_nickname, room_id);
      console.log(`summary_collection의 ${user_nickname}에게 요약 정보 전달`);
    }
    console.log('Finish Complete!');
  }

  @Post(':room_id/summary')
  async findFromDBAndGetSummary(@Param('room_id') room_id: string, @Body() userNickname: { user_nickname: string }) {
    const { user_nickname } = userNickname;
    const summaryfromDB = await this.roomService.findFromDBAndGetSummary(room_id, user_nickname);
    console.log(`summary_collection의 ${user_nickname}의 summary 가져옴`);
    console.log('Summary Complete!');
    return { summaryfromDB };
  }

  @Get(':room_id/quiz')
  async findFromDBAndMakeQuiz(
    @Param('room_id') room_id: string,
  ): Promise<{ result: string }> {
    console.log('Quiz start!!');
    const findQuiz = await this.gptService.findQuizfromDB(room_id)
    if (!findQuiz) {
      const gpt_roll = `You are the one who gives the O/X quiz. Make 10 O/X quizzes in Korean according to the following contents.
                   Instructions:
                   - Don't make duplicate quizzes.
                   - following this example format strictly -> 퀴즈 1: 사자는 포유류에 속한다. 답: O.
                   - Don't use example as quiz.
                   - When creating a quiz set, the ratio of correct and incorrect answers in the quiz should be 50%.
                   - Don't give extra explanation of answer.
                   - Process should be completed in 10 seconds.`;
      const { prompt } = await this.gptService.findFromDB(room_id);
      console.log(prompt);

      const result = await this.gptService.generateText(gpt_roll, prompt);
      this.gptService.quiztoDB(result, room_id);
      console.log('Quiz Complete!');
      return { result };
    }
    console.log('Quiz Complete!');
    return { result: findQuiz };
  }


  @Post(':room_id/question')
  async findFromDBAndAnswerQuestion(@Param('room_id') room_id: string, @Body() userRequest: { user_request: string }) {
    const { user_request } = userRequest;
    console.log('Question Start!!');
    // console.log(`user_request: ${user_request}`);
    // console.log('question test');
    // console.log(user_request);
    const gpt_roll = `You are the one responsing to request. answer this request(${user_request}) in Korean correctly based on following contents.
                  Instructions:
                  - The answer must be completed within 5 seconds.
                  - The answer must be 3 sentences or less. `;
    const { prompt } = await this.gptService.findFromDB(room_id);
    // console.log(prompt);
    const result = await this.gptService.generateText(gpt_roll, prompt);
    console.log('Question Complete!');
    return { result };
  }
  
  @Post(':room_id/update')
  async func (@Param('room_id') room_id: string, @Body() userInfoAndMessage: {user_nickname: string, message_summary: string[]}){
    console.log('Update Start');
    const {user_nickname, message_summary } = userInfoAndMessage;
    // console.log(`received user_nickname: ${user_nickname}, received message_summary: ${message_summary}`);
    const result = await this.gptService.findFromSummaryAndUpdate(room_id, user_nickname, message_summary);
    // console.log(`updated message_summary: ${result.message_summary}`);
    console.log('Update Complete!')
    return {summaryfromDB: [{message_summary:result.message_summary}]};
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
