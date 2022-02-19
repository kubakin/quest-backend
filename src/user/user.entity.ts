import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../__shared/enums/enums';
import { Team } from '../team/team.entity';
import { JoinColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: ''})
    email: string;

    @Column({default: ''})
    password: string;

    @Column({default: Role.User})
    role: Role;

    @ManyToOne(type => Team, team => team.users, {eager: true, onDelete: 'SET NULL'})
    team: Team;

    @Column({default: '', unique: true})
    username: string;
}
