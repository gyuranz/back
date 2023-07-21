import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/user.entity';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({ 
      //! 여기 조절해서 DB 변경 가능(375pg)
      type:'sqlite',
      database: 'login.sqlite',
      entities: [User],
      synchronize: true,
      logging: true,
    }),
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
