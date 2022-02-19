import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { StatusGame } from '../__shared/enums/enums';

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: new Date()})
    start: Date;

    @Column({default: new Date()})
    end: Date;

    @Column({default: StatusGame.NOT_STARTED})
    statusGame!: StatusGame

    @Column({default: false})
    mix: boolean;
}
