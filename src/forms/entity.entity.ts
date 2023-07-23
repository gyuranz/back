// import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ListCollectionsCursor } from 'typeorm';
// import { JoinRoomDto } from './room.dto';

// @Entity()
// export class User {
//     @PrimaryGeneratedColumn()
//     user_code: number;

//     @Column({ unique: true })
//     user_id: string;

//     @Column()
//     user_password: string;

//     @Column({ unique: true })
//     user_nickname: string;

//     @Column('simple-json', { nullable: true })
//     user_joined_room: JoinRoomDto[]

//     @CreateDateColumn()
//     createUser_Dt: Date;

// }

// @Entity()
// export class Room {
//     @PrimaryGeneratedColumn()
//     room_id: number;

//     @Column()
//     room_name: string;

//     @Column()
//     room_password: string;

//     @Column('simple-json', { nullable: true })
//     room_chat_contents: { user_code: number, user_nickname: string, message_id: string, message_text: string, message_creatAt: Date }[];

//     @Column('simple-json', { nullable: true })
//     room_joined_user: { user_code:number }[];
// }