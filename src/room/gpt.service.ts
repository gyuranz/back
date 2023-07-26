import { HttpException, Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Ppt, STT, Summ } from 'src/forms/schema.schema';
import { Model } from 'mongoose';


@Injectable()
export class GptService {
    openai: OpenAIApi;
    constructor(
        private readonly configService: ConfigService,
        @InjectModel(Ppt.name) private pptModel: Model<Ppt>,
        @InjectModel(Summ.name) private summModel: Model<Summ>
    ) {
        const configuration = new Configuration({
            organization: this.configService.get<string>('OPENAI_ORGANIZATION'),
            apiKey: this.configService.get<string>('CHATGPT_OPEN_API_KEY')
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
            console.log(response.data.choices[0].message.content)
            return response.data.choices[0].message.content
        } catch (error) {
            console.log(error)
            throw new HttpException('Error making API request', error.response.status);
        }
    }

    async findFromDB() {
        // prompt는 요약, 퀴즈, 질문 마다 다르게 하면 될듯 
        let prompt = "이 다음에 나오는 글을  필요없어보이는 말은 빼고 10개 문장으로 요약해줘. 말끝에 '~했음,' 식으로 출력하고 전체를 배열형식으로 출력해줘\n";
        // 이거 발표용 DB 스키마 로 수정해야됌
        const result = await this.pptModel.find({}, 'message_text');
        const extractResult = result.map((data) => data.message_text);
        for (let elem of extractResult) {
            prompt += elem;
        }
        // prompt += extractResult[0];
        // prompt += extractResult[1];
        // console.log(prompt)
        return prompt;
    }

    async generateText(prompt: string): Promise<string> {
        return this.generateTextGPT3(prompt);
    }

    // async gotoSummary() {
    //     const prompt = await this.findFromDB();
    //     const summary = await this.generateText(prompt);

    //   }
    SummarytoDB(summary:string): Promise<Summ> {
        const summdto = {
            summary: summary,
        }
        return this.summModel.create(summdto);
    }

    async findFromSummaryDB() {
        const result = await this.summModel.find({}, 'summary');
        let extractResult = result.map((data) => data.summary);
        let summarytoArray = extractResult[0].split(",");
        console.log(typeof summarytoArray);
        console.log(summarytoArray);
        return {'summary':summarytoArray}
    }
}
