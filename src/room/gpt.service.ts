import { HttpException, Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, Quiz, Summary } from 'src/forms/schema.schema';
import { OcrService } from './ocr.service';

@Injectable()
export class GptService {
    openai: OpenAIApi;
    constructor(
        private readonly configService: ConfigService,
        private ocrService: OcrService,
        @InjectModel(Chat.name) private chatModel: Model<Chat>,
        @InjectModel(Quiz.name) private quizModel: Model<Quiz>,
        @InjectModel(Summary.name) private summaryModel: Model<Summary>
    ) {
        const configuration = new Configuration({
            organization: this.configService.get<string>(`OPENAI_ORGANIZATION`),
            apiKey: this.configService.get<string>(`CHATGPT_OPEN_API_KEY`)
        })
        this.openai = new OpenAIApi(configuration);
    }


    async generateTextGPT3(gpt_roll:string, prompt: string) {
        try {
            console.log('GPT start');
            const response = await this.openai.createChatCompletion({
                model: 'gpt-3.5-turbo-16k',
                messages: [
                    {role: 'system', content:gpt_roll},
                    {role: 'user', content: prompt },
                ],
                max_tokens: 3000,
                temperature: 0.5
            })
            console.log("GPT 수행 완료");
            return response.data.choices[0].message.content;
        } catch (error) {
            console.log("GPT 에러발생: ", error.response.status);
            throw new HttpException('Error making API request', error.response.status);
        }

        //! 파싱을 해서 ["","",""]식으로 
        
    }

    async generateText(gpt_roll: string, prompt: string): Promise<string> {
        return this.generateTextGPT3(gpt_roll, prompt);
    }

    //요약용
    async findChatLogFromDBforSummary(roomId: string) {
        // console.log('DB searching');
        let promptstack = [];
        let prompt = "";
        let imgUrl = "";

        const result = await this.chatModel.find({ room_id: roomId })
            .sort({ chat_creatAt: -1 })
            .select({ message: 1, img_metadata: 1 });
        for (const data of result) {
            if (data.message) {
                promptstack.push(`${data.message}\n`);
            } else if (data.img_metadata) {
                imgUrl = `https://aitolearn.s3.ap-northeast-2.amazonaws.com/${data.img_metadata}\n`;
                // prompt += imgUrl;
                promptstack.push(await this.ocrService.textExtractionFromImage(imgUrl));
                break;
            }
        }
        // console.log(promptstack);
        for (var i = promptstack.length - 1; i >= 0; i--) {
            prompt += promptstack[i]
        }
        return { prompt, imgUrl };
    }


    async findFromDB(roomId: string) {
        // console.log('DB searching');
        let prompt="";              
        let imgUrls = [];
        let imgUrl = "";
        
        const result = await this.chatModel.find({room_id: roomId})
            .sort({chat_creatAt:1})
            .select({message:1, img_metadata:1});
        for (const data of result) {
            if(data.img_metadata) {
                imgUrl = `https://aitolearn.s3.ap-northeast-2.amazonaws.com/${data.img_metadata}\n`;
                // prompt += imgUrl;
                prompt += await this.ocrService.textExtractionFromImage(imgUrl);
                // prompt += '\n';
            }else if (data.message) {
                // prompt += `${data.message}\n`;

                
                prompt += `${data.message}`;
            }
        } 
        // console.log(prompt)
        return {prompt, imgUrls};
    }

    quiztoDB(result, room_id){
        this.quizModel.create({quiz_message:result , room_id: room_id});
    }

    async findQuizfromDB(room_id){
        
        const findQuiz=await this.quizModel.find({room_id:room_id},{quiz_message:true});
        console.log(findQuiz);
        console.log(findQuiz.length);
        console.log(findQuiz.toString);

        if (findQuiz.length > 0){
            return findQuiz[0].quiz_message;
        }
        else{
            return null;
        }
    }
    async findFromSummaryAndUpdate(room_id: string, user_nickname: string, message_summary: string[]) {
        await this.summaryModel.deleteMany({room_id:room_id, user_nickname:user_nickname});
        const result = new this.summaryModel({room_id:room_id, user_nickname:user_nickname, message_summary:message_summary}).save();
        return result;
    }
    // async pushtoDB(a) {
    //     const result = await this.summModel.updateMany({}, 'message_summary');
    //     let extractResult = result.map((data) => data.message_summary[0]);
    //     let summarytoArray = extractResult[0].split(".");
    //     console.log(typeof summarytoArray);
    //     console.log(summarytoArray);
    //     return { 'summary': summarytoArray }
    // }
    // async findFromSummaryDB() {
    //     const result = await this.summModel.find({}, 'message_summary');
    //     let extractResult = result.map((data) => data.message_summary[0]);
    //     let summarytoArray = extractResult[0].split(".");
    //     console.log(typeof summarytoArray);
    //     console.log(summarytoArray);
    //     return {'summary':summarytoArray}
    // }
}

