import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { getFileType, updateHelpCoolDown } from '../__shared/helpers/helpers';
import { FileService, FileType } from '../file/file.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { TasksForTeam } from './tasks-for-team.entity';
import { AnswerDto } from './dto/answer.dto';
import { TeamService } from '../team/team.service';
import { Team } from '../team/team.entity';

@Injectable()
export class TaskService {
    constructor(@InjectRepository(Task) private readonly taskRepository: Repository<Task>,
                @InjectRepository(TasksForTeam) private readonly taskTeamRepository: Repository<TasksForTeam>,
                private readonly fileService: FileService,
                @Inject(forwardRef(()=> UserService)) private readonly userService: UserService,
                @Inject(forwardRef(()=> TeamService)) private readonly teamService: TeamService) {
    }

    async create(dto: Task, file = null) {
        const task = await this.taskRepository.findOne({where:{id: dto.id}});
        if (file) {
            const {fileExtension, filePath} = this.fileService.createFile(FileType.FILE, file);
            const fileType = getFileType(fileExtension);
            return await this.taskRepository.save({...task, ...dto, file:filePath, fileType});
        }
            return await this.taskRepository.save({...task, ...dto});
    }

    async getAll() {
        const tasks = await this.taskRepository.find();
        return tasks;
    }

    async getCurrentTaskUser(user: User) {
        return await this.getCurrentTaskTeam(user.team);
    }

    async getCurrentTaskTeam(team: Team) {
        const taskOfTeam = await this.taskTeamRepository.findOne({
            where:{team, is_completed: false},
            order: {order: 'ASC'}});
        console.log('-----------')
        console.log(taskOfTeam);
        if (taskOfTeam && !taskOfTeam.next_help) {
            taskOfTeam.next_help = updateHelpCoolDown();
            await this.taskTeamRepository.save(taskOfTeam);
        }
        return taskOfTeam || null;
    }

    async answerToTask(user: User, dto: AnswerDto) {
        const task = user.team.currentTask;
        if (task.task.answer.toLowerCase() === dto.answer.toLowerCase()) {
            await this.teamService.changeScoreTeam(user.team, 10);
            task.is_completed = true;
            await this.taskTeamRepository.save((task));
            user.team.progress++;
            const team = await this.teamService.setTaskToTeam(user.team);
            user.team = team;
            return user;
        }
        else {
            // await this.teamService.changeScoreTeam(user.team, 0);
            throw new HttpException('Неправильный ответ!', HttpStatus.BAD_REQUEST);
        }
    }

    async getTaskById(id: number) {
        return await this.taskRepository.findOne(id, {relations: ['helps']});
    }

    async updateHelpStatus(taskForTeam: TasksForTeam) {
        taskForTeam.next_help = updateHelpCoolDown();
        taskForTeam.help_status++;
        return await this.taskTeamRepository.save(taskForTeam)
    }

    async deleteOtherPackIfExist(team: Team) {
        await this.taskTeamRepository.delete({team});
    }

    async deleteTask(id) {
        return await this.taskRepository.delete(id);
    }
}
