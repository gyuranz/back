import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import { JoinRoomDto } from "./room.dto";
import { type } from "os";
import { randomBytes } from "crypto"

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

    //! 어떻게 튜플orArray를 집어넣을 것인지 추후 수정
    @Prop({ type: [{ room_id: String, room_name: String, summary: String }] })
    user_joined_room_list: { room_id: string, room_name: string, summary: string }[];

    @Prop()
    createUser_Dt: Date;
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

    //! 어떻게 튜플orArray를 집어넣을 것인지 추후 수정
    @Prop({ type: [{ user_code: Number, user_nickname: String, message_id: String, message_text: String, message_creatAt: Date }] })
    room_chat_contents: { user_code: number, user_nickname: string, message_id: string, message_text: string, message_creatAt: Date }[];

    //! 어떻게 튜플orArray를 집어넣을 것인지 추후 수정
    @Prop({ type: [{ user_id: String, user_nickname: String }], default: [] })
    room_joined_user: { user_id: string; user_nickname: string }[];
}



export const UserSchema = SchemaFactory.createForClass(User);
export const RoomSchema = SchemaFactory.createForClass(Room);
