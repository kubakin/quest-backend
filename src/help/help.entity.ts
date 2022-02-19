import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from '../task/task.entity';

@Entity()
export class Help {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    text: string;

    @Column({default: 3})
    price: number;

    @ManyToOne(type => Task, task=>task.helps, {onDelete: 'CASCADE'})
    task: Task;
}
