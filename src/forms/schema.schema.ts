import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import { JoinRoomDto } from "./room.dto";
import { type } from "os";
import { randomBytes } from "crypto"
import { Timestamp } from "mongodb";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class Ppt{
    @Prop()
    socket_id: string;
    
    @Prop()
    message_text: string;
    
    @Prop({default:Date.now})
    creatAt:Date;
}

@Schema()
export class User {
    @Prop()
    user_code: number;

    @Prop({ unique: true })
    user_id: string;

    @Prop()
    user_password: string;

    @Prop({ unique: true })
    user_nickname: string;

    @Prop({ type: [{ room_id: String, room_name: String, summary: String }] })
    user_joined_room_list: { room_id: string, room_name: string, summary: string }[];

    // @Prop()
    // createUser_Dt: Date;
}

@Schema()
export class Room {
    @Prop()
    room_id: string;

    @Prop()
    room_name: string;

    @Prop()
    room_password: string;

    @Prop()
    room_summary: string;
    
    @Prop()
    entire_chat: string;

    @Prop({ type: [{ user_id: String, user_nickname: String }], default: [] })
    room_joined_user_list: { user_id: string; user_nickname: string }[];
}

@Schema()
export class STT{
    @Prop()
    stt_message: string;
}

@Schema()
export class Chat{

    @Prop()
    room_id:string;

    @Prop()
    user_nickname:string;
    
    @Prop()
    chat_id:string;
    
    @Prop()
    chat_text:string;
    
    @Prop({default:Date.now})
    chat_creatAt:Date;
    
    // @Prop({type: [{user_nickname:String, user_id:String, message_id:String, message_text:String, message_creatAt:Date}], default: []})
    // realtime_chat: {user_nickname:string, user_id:string, message_id:string, message_text:string, message_creatAt:Date}[];
}

export const PptSchema = SchemaFactory.createForClass(Ppt);
export const UserSchema = SchemaFactory.createForClass(User);
export const RoomSchema = SchemaFactory.createForClass(Room);
export const ChatSchema = SchemaFactory.createForClass(Chat);
export const STTSchema = SchemaFactory.createForClass(STT);
