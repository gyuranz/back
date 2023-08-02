import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import { JoinRoomDto } from "./room.dto";
import { type } from "os";
import { randomBytes } from "crypto"
import { Timestamp } from "mongodb";

export type UserDocument = HydratedDocument<User>;


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
    // add
    @Prop({type: [{ user_id: String, user_nickname: String}]})
    room_joined_user_list: {user_id: string, user_nickname: string}[];
}


@Schema()
export class Chat {

    @Prop()
    room_id: string;

    @Prop()
    user_nickname: string;

    @Prop()
    message: string;

    @Prop()
    img_metadata: string;

    @Prop({ default: Date.now })
    chat_creatAt: Timestamp;

    // @Prop({type: [{user_nickname:String, user_id:String, message_id:String, message_text:String, message_creatAt:Date}], default: []})
    // realtime_chat: {user_nickname:string, user_id:string, message_id:string, message_text:string, message_creatAt:Date}[];
}

@Schema()
export class Summary {
    
    @Prop()
    user_nickname: string;
    
    @Prop()
    room_id: string;

    @Prop({ type: [{type: String}] })
    message_summary: string [];

    @Prop()
    img_url: string;

    @Prop({ default: Date.now })
    chat_creatAt: Timestamp;
}


export const SummarySchema = SchemaFactory.createForClass(Summary);
export const UserSchema = SchemaFactory.createForClass(User);
export const RoomSchema = SchemaFactory.createForClass(Room);
export const ChatSchema = SchemaFactory.createForClass(Chat);
