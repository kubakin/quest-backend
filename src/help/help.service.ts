import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Help } from './help.entity';
import { Repository } from 'typeorm';
import { TaskService } from '../task/task.service';
import { User } from '../user/user.entity';
import { CreateHelpDto } from './dto/create-help.dto';
import { firstDateBigger } from '../__shared/helpers/helpers';
import { TeamService } from '../team/team.service';

@Injectable()
export class HelpService {
    constructor(@InjectRepository(Help) private readonly helpRepository: Repository<Help>,
                private readonly taskService: TaskService,
                private readonly teamService: TeamService) {
    }
    async getHelp(user: User) {

        const team = await this.taskService.getCurrentTaskUser(user);
        const helps = await this.helpRepository.find({task: team.task});
        if (team.help_status > helps.length - 1) {
            throw new HttpException('Подсказки закончились!', HttpStatus.NOT_FOUND);
        }
        if (firstDateBigger(team.next_help)) {
            if (team.help_status - 1 >= 0) {
                return helps[team.help_status-1];
            }
            throw new HttpException('Подсказка еще не доступна!', HttpStatus.NOT_FOUND);
        }
        const help = helps[team.help_status];
        await this.taskService.updateHelpStatus(team);
        await this.teamService.changeScoreTeam(user.team, -help.price);
        return help;
    }

    async create(dto: CreateHelpDto) {
        const task = await this.taskService.getTaskById(dto.task_id);
        const help = await this.helpRepository.save({task, text: dto.text});
        return help;
    }
}
