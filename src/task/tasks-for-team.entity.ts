import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from './task.entity';
import { Team } from '../team/team.entity';
import { getRandomInt } from '../__shared/helpers/helpers';

@Entity()
export class TasksForTeam {

    // @BeforeInsert()
    // addOrders(event) {
    //     this.order = getRandomInt(100);
    //
    // }

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Task, task => task.taskToTeam, {eager: true, onDelete: 'CASCADE'})
    task!: Task;

    @Column({default: null})
    next_help: Date;

    @Column({default: 0})
    help_status: number;

    @ManyToOne(type => Team, team => team.taskToTeam, {onDelete: 'CASCADE'})
    team!: Team;

    @Column({default: 0})
    order: number;

    @Column({default: false})
    is_completed: boolean;
}
