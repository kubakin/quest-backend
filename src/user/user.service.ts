import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { Role } from '../__shared/enums/enums';
import { CreateEnterTeamDto } from '../team/dto/create-enter-team.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { TeamService } from '../team/team.service';
import { iRequestData } from '../__shared/types/types';
import { LoginDto } from '../auth/dto/login.dto';
import { isEmptyObject } from '../__shared/helpers/helpers';
import { Team } from '../team/team.entity';

@Injectable()
export class UserService implements OnModuleInit {

    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
                private readonly teamService: TeamService) {
    }

    async onModuleInit() {
        let admin = await this.userRepository.findOne({where: {role: Role.Admin}});
        if (!admin) {
            admin = await this.userRepository.save(
                {username: process.env.ADMIN_USERNAME, password: process.env.ADMIN_PASSWORD, role: Role.Admin}
            )
            console.log('ADMIN CREATED');
            return
        }
        return

    }

    async enterToTeam(team: Team, req: iRequestData) {
        const user = await this.userRepository.findOne(req.user);
        user.team = team;
        const userInTeam = await this.userRepository.save(user);
        return userInTeam;
    }

    async enterToTeamByName(dto: CreateEnterTeamDto, req: iRequestData) {
        const team = await this.teamService.findByName(dto);
        if (!team) {
            throw new HttpException('Команды не существует', HttpStatus.BAD_REQUEST);
        }
        return await this.enterToTeam(team, req);
    }

    async create(dto: LoginDto) {
        return await this.userRepository.save(dto);
    }

    async findByUsername(username: string) {
        const user = await this.userRepository.findOne(
            {where: {username: username}});
        return user;
    }

    async leaveTeam(req: iRequestData) {
        if (!req.user.team) {
            throw new HttpException('Вы не состоите в команде', HttpStatus.BAD_REQUEST);
        }
        req.user.team = null;
        return await this.userRepository.save(req.user);
    }

    async getFullUser(id: number) {
        const user = await this.userRepository.findOne(id);
        return user;
    }

    async getAll() {
        return await this.userRepository.find();
    }

    async deleteUser(id) {
        return await this.userRepository.delete(id);
    }


}
