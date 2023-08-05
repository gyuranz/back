import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ImageAnnotatorClient } from '@google-cloud/vision';

@Injectable()
export class OcrService {
  client: ImageAnnotatorClient;
  constructor(private readonly configService: ConfigService) {
  
  const configuration = {
    projectId: this.configService.get<string>(`OCR_PROJECT_ID`),
    keyFilename: this.configService.get<string>(`OCR_KEY_FILE_NAME`)
  }
  this.client = new ImageAnnotatorClient(configuration);
  }

  async textExtractionFromImage(imgUrl) {
    const [ result ] = await this.client.textDetection(imgUrl);
    const detections = result.textAnnotations;
    // console.log('Text: ');
    console.log(detections[0].description);
    return detections[0].description;
  }
}
