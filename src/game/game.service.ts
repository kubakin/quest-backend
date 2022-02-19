import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { Repository } from 'typeorm';
import { CreateUpdateGameDto } from './dto/create-update-game.dto';
import { TeamService } from '../team/team.service';
import { TaskService } from '../task/task.service';

@Injectable()
export class GameService implements OnModuleInit{
    constructor(@InjectRepository(Game) private readonly gameRepository: Repository<Game>,
                private readonly taskService: TaskService) {}

    async onModuleInit() {
        await this.createGameIfNotExist();
    }

    async createGameIfNotExist() {
        let game = await this.gameRepository.findOne()
        if (!game) {
            game = await this.gameRepository.save({start: new Date(), end: new Date()});
            console.log('GAME WAS CREATED');
        }
        return game;
    }

    async updateGame(dto: CreateUpdateGameDto) {
        const game = await this.createGameIfNotExist();
        console.log(dto)
        return await this.gameRepository.save({...game, ...dto});
    }

    async getGame() {
        const game = await this.gameRepository.findOne();
        const totalTasks = (await this.taskService.getAll()).length;
        return {...game, totalTasks};

    }
}
