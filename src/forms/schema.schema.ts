import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory,} from '@nestjs/mongoose';
import { JoinRoomDto } from "./room.dto";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User{
    @Prop()
    user_code: number;

    @Prop({ unique :true })
    user_id: string;

    @Prop()
    user_password: string;

    @Prop({ unique :true })
    user_nickname: string;

    //! 어떻게 튜플orArray를 집어넣을 것인지 추후 수정
    @Prop()
    user_joined_room: JoinRoomDto[];

    @Prop()
    createUser_Dt: Date;
}

@Schema()
export class Room{
    @Prop()
    room_id: number;

    @Prop()
    room_name: string;

    @Prop()
    room_password: string;

    //! 어떻게 튜플orArray를 집어넣을 것인지 추후 수정
    @Prop()
    room_chat_contents: { user_code: number, user_nickname: string, message_id: string, message_text: string, message_creatAt: Date }[];

    //! 어떻게 튜플orArray를 집어넣을 것인지 추후 수정
    @Prop()
    room_joined_user: { user_code:number }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
export const RoomSchema = SchemaFactory.createForClass(Room);