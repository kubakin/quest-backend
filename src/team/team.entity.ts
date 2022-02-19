import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from '../__shared/enums/enums';
import { User } from '../user/user.entity';
import { TasksForTeam } from '../task/tasks-for-team.entity';

@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    name: string;

    @Column({default: Status.NOT_ACTIVATED})
    status: Status;

    @Column({default: 0})
    progress: number;

    @JoinColumn()
    @OneToMany(type=> User, user=>user.team, )
    users: User[];

    @Column({default: 0})
    score: number;

    @JoinColumn()
    @OneToMany(()=> TasksForTeam, taskToTeam=>taskToTeam.team, {onDelete: "SET NULL"})
    taskToTeam: TasksForTeam[]

    @OneToOne(()=>TasksForTeam, {eager: true, onDelete: "SET NULL"})
    @JoinColumn()
    currentTask!: TasksForTeam;
}
