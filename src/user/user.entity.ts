import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    user_code: number;


    @Column({ unique: true })
    user_id: string;

    // @Column({unique:true})
    // user_email: string;

    @Column()
    user_password: string;

    @Column({ unique: true })
    user_nickname: string;

    // @Column
    // user_room: {room_id : chat_summary, ... }

    @Column({ default: true })
    createUser_Dt: Date = new Date();
    
    @Column({ nullable: true })
    currentRefreshToken: string;
  
    @Column({ type: 'datetime', nullable: true })
    currentRefreshTokenExp: Date;
}
