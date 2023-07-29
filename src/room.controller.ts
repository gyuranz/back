import { Controller, Get } from '@nestjs/common';
import { OcrService } from './ocr.service';

@Controller('ocr')
export class RoomController {
  constructor(private readonly ocrService: OcrService) {}

  @Get('service')
  textExtraction() {
    return this.ocrService.textExtractionFromImage();
  }
}
