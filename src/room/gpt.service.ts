import { HttpException, Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, Summ } from 'src/forms/schema.schema';


@Injectable()
export class GptService {
    openai: OpenAIApi;
    constructor(
        private readonly configService: ConfigService,
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
            return response.data.choices[0].message.content
        } catch (error) {
            console.log(error)
            throw new HttpException('Error making API request', error.response.status);
        }
    }

    async findFromDB() {
        // prompt는 요약, 퀴즈, 질문 마다 다르게 하면 될듯 
        console.log('도착2');
        let prompt = "이 다음에 나오는 글을 5줄로 요약해줘 \n";
        // 이거 발표용 DB 스키마 로 수정해야됌
        const result = await this.chatModel.find({}, 'message');
        const extractResult = result.map((data) => data.message);
        for (let elem of extractResult) {
            prompt += elem;
        }
        // prompt += extractResult[0];
        // prompt += extractResult[1];
        console.log(prompt)
        return prompt;
    }

    async generateText(prompt: string): Promise<string> {
        return this.generateTextGPT3(prompt);
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
