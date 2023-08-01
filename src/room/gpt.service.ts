import { HttpException, Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { ConfigService } from '@nestjs/config';
import { OcrService } from './ocr.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, Summ } from 'src/forms/schema.schema';


@Injectable()
export class GptService {
    openai: OpenAIApi;
    constructor(
        private readonly configService: ConfigService,
        private ocrService: OcrService,
        @InjectModel(Chat.name) private chatModel: Model<Chat>,
        @InjectModel(Summ.name) private summModel: Model<Summ>,
        ) {
        const configuration = new Configuration({
            organization: this.configService.get<string>(`OPENAI_ORGANIZATION`),
            apiKey: this.configService.get<string>(`CHATGPT_OPEN_API_KEY`)
        })
        this.openai = new OpenAIApi(configuration);
    }


    async generateTextGPT3(prompt: string) {
        try {
            console.log('test test')
            const response = await this.openai.createChatCompletion({
                model: 'gpt-3.5-turbo-16k',
                messages: [
                    { role: 'user', content: prompt }
                ],
                max_tokens: 10000,
                temperature: 1
            })
            console.log(response.data.choices[0].message.content);
            return response.data.choices[0].message.content;
        } catch (error) {
            console.log(error)
            throw new HttpException('Error making API request', error.response.status);
        }
    }
    
    async generateText(prompt: string): Promise<string> {
        return this.generateTextGPT3(prompt);
    }
    async findFromDB(roomId: string) {
        // prompt는 요약, 퀴즈, 질문 마다 다르게 하면 될듯 
        console.log('DB searching');
        let prompt="";              
        let imgUrls = [];
        let imgUrl = "";
        // 이거 발표용 DB 스키마 로 수정해야됌
        // const result = await this.chatModel.find({room_id: roomId}, 'message');
        // const extractResult = result.map((data) => data.message);
        // for (let elem of extractResult) {
        //     prompt += elem;
        // }
        // prompt += extractResult[0];
        // prompt += extractResult[1];
        
        const result = await this.chatModel.find({room_id: roomId})
            .sort({chat_creatAt:1})
            .select({message:1, img_metadata:1});
        for (const data of result) {
            if(data.img_metadata) {
                imgUrl = `https://aitolearn.s3.ap-northeast-2.amazonaws.com/${data.img_metadata}\n`;
                // prompt += imgUrl;
                prompt += await this.ocrService.textExtractionFromImage(imgUrl);
                prompt += '\n';
            }else if (data.message) {
                prompt += `${data.message}\n`;
            }
        } 
        // console.log(prompt)
        return {prompt, imgUrls};
    }


    
    async findFromSummaryDB() {
        const result = await this.summModel.find({}, 'summary');
        let extractResult = result.map((data) => data.summary);
        let summarytoArray = extractResult[0].split(".");
        console.log(typeof summarytoArray);
        console.log(summarytoArray);
        return {'summary':summarytoArray}
    }
}
