import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Room, RoomSchema, User, UserSchema } from './forms/schema.schema';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{name: User.name, schema: UserSchema},{name: Room.name, schema: RoomSchema}]),
    MongooseModule.forRoot("mongodb+srv://rlaehddbs2238:rlaehddbs123@cluster0.uusqfxm.mongodb.net/?retryWrites=true&w=majority"),
    // TypeOrmModule.forFeature([User,Room]),
    // TypeOrmModule.forRoot({ 
    //   //! 여기 조절해서 DB 변경 가능(375pg)
    //   type:'mongodb',
    //   database: 'login.sqlite',
    //   entities: [User],
    //   synchronize: true,
    //   logging: true,
    // }),
    AuthModule,
  // MongooseModule.forRoot('mongodb://loclahost/nest')
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
