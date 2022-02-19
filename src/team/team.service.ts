import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateEnterTeamDto } from './dto/create-enter-team.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './team.entity';
import { Connection, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { TaskService } from '../task/task.service';
import { TasksForTeam } from '../task/tasks-for-team.entity';
import { Status } from '../__shared/enums/enums';
import { iRequestData } from '../__shared/types/types';
import { GameService } from '../game/game.service';
import { getRandomInt } from '../__shared/helpers/helpers';
import { UpdateTeamDto } from './dto/update-team';

@Injectable()
export class TeamService {
    constructor(@InjectRepository(Team) private readonly teamRepository:Repository<Team>,
                @Inject(forwardRef(()=>UserService))
                private readonly userService: UserService,
                private readonly taskService: TaskService,
                private readonly gameService: GameService,
                private connection: Connection) {
    }

    async create(dto: CreateEnterTeamDto, req: iRequestData) {
        let team = await this.findByName(dto);
        if (team) {
            throw new HttpException('Команда уже существует', HttpStatus.BAD_REQUEST);
        }
        team = await this.teamRepository.save(dto);
        await this.setPackForTeam(team);
        return await this.userService.enterToTeam(team, req);
    }

    async findByName(value) {
        const team = await this.teamRepository.findOne(value);
        return team;
    }

    async getTeamByPk(id: number) {
        console.log(id)
        return await this.teamRepository.findOne(id, {relations: ['users']});
    }

    async findAll() {
        const teams = await this.teamRepository.find({relations: ['taskToTeam']});
        return teams;
    }

    async setPackForTeam(team: Team) {
        const tasks = await this.taskService.getAll();
        const game = await this.gameService.getGame();
        await this.taskService.deleteOtherPackIfExist(team);
        const tasksForTeam:TasksForTeam[] = tasks.map((item, index)=> {
            const taskTeam = new TasksForTeam();
            taskTeam.task = item;
            taskTeam.team = team;
            if (game.mix) {
                taskTeam.order = getRandomInt(100);
            }
            else {
                taskTeam.order = item.default_order;
            }
            return taskTeam
        })
        return await this.connection.manager.save(tasksForTeam);
    }

    async changeScoreTeam(team: Team, points: number) {
        team.score = team.score + points;
        if (team.score < 0) {
            team.score = 0;
        }
        return await this.teamRepository.save(team);
    }

    async setTaskToTeam(team: Team) {
        const task = await this.taskService.getCurrentTaskTeam(team);
        team.currentTask = task;
        if (!task) {
            team.status = Status.FINISHED;
        }
        return await this.teamRepository.save(team);

    }

    async activateTeam(id: number) {
        const team = await this.getTeamByPk(+id);
        team.progress = 0;
        team.score = 0;
        team.status = Status.ACTIVATED;
        await this.teamRepository.save(team);
        await this.setPackForTeam(team);
        await this.setTaskToTeam(team);
        return team;

    }

    async getTopTeam() {
        return await this.teamRepository.find({order: {score: 'DESC'}, take: 10});
    }

    async updateTeam(id: number, dto: UpdateTeamDto) {
        const team = await this.teamRepository.findOne(id);
        return await this.teamRepository.save({...team, ...dto})
    }

    async deleteTeam(id) {
        return await this.teamRepository.delete(id);
    }

}
