import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Help } from '../help/help.entity';
import { FileType } from '../__shared/enums/enums';
import { TasksForTeam } from './tasks-for-team.entity';

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    text: string;

    @Column({default: ''})
    answer: string;

    @Column({default: 10})
    price: number;

    @Column({nullable: true})
    file: string;

    @OneToMany(type => Help, help => help.task, {nullable: true, onDelete: 'CASCADE'})
    helps: Help[]

    @Column({default: FileType.NO_FILE})
    fileType: FileType;

    @OneToMany(()=> TasksForTeam, taskToTeam=>taskToTeam.task, {onDelete: 'CASCADE'})
    taskToTeam: TasksForTeam[]

    @Column({default: 0})
    default_order: number;

}
