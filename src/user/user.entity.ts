import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    // @Column({unique:true})
    // user_email: string;

    @Column()
    user_password: string;

    @Column({ unique: true })
    user_nickname: string;

    // @Column
    // user_room: {room_id : chat_summary, ... }

    @Column({ default: true })
    createDt: Date = new Date();
}
