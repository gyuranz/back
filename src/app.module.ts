import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Room, RoomSchema, User, UserSchema } from './forms/schema.schema';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SttModule } from './stt/stt.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: User.name, schema: UserSchema},{name: Room.name, schema: RoomSchema}]),
    MongooseModule.forRoot("mongodb+srv://rlaehddbs2238:rlaehddbs123@cluster0.uusqfxm.mongodb.net/?retryWrites=true&w=majority"),
    // SttModule,
    AuthModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
