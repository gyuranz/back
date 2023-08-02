import { HttpException, Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, Summary } from 'src/forms/schema.schema';
import { OcrService } from './ocr.service';

@Injectable()
export class GptService {
    openai: OpenAIApi;
    constructor(
        private readonly configService: ConfigService,
        private ocrService: OcrService,
        @InjectModel(Chat.name) private chatModel: Model<Chat>,
        @InjectModel(Summary.name) private summModel: Model<Summary>,
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

        //! 파싱을 해서 ["","",""]식으로 
        
    }

    async generateText(prompt: string): Promise<string> {
        return this.generateTextGPT3(prompt);
    }

    //요약용
    async findChatLogFromDBforSummary(roomId: string) {
        console.log('DB searching');
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
        console.log(promptstack);
        for (var i = promptstack.length - 1; i >= 0; i--) {
            prompt += promptstack[i]
        }
        return { prompt, imgUrl };
    }


    async findFromDB(roomId: string) {
        console.log('DB searching');
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

