import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Post()
  // async checkHaveToken(@Body() token:string) {
  //   return this.appService.checkHaveToken(token);
  // }
}
