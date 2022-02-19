import {
    Body,
    Controller,
    Get,
    Post,
    UploadedFiles,
    UseInterceptors,
    Request,
    Inject,
    forwardRef, Param
} from '@nestjs/common';
import { TaskService } from './task.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateTaskDto } from './dto/create-task.dto';
import { iRequestData } from '../__shared/types/types';
import { AnswerDto } from './dto/answer.dto';
import { Task } from './task.entity';

@Controller('task')
export class TaskController {
    constructor(private readonly taskService: TaskService) {
    }

    @Post('')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'file', maxCount: 1 },
    ]))
    create(@UploadedFiles() files, @Body() dto) {
        const jsonDto = JSON.parse(dto.val)
        if (!files?.file) {
            return this.taskService.create(jsonDto);
        }
        return this.taskService.create(jsonDto, files?.file[0]);
    }

    @Get('')
    getAll() {
        return this.taskService.getAll();
    }

    @Get('current')
    getCurrentTask(@Request() req: iRequestData) {
        return this.taskService.getCurrentTaskUser(req.user);
    }

    @Post('answer')
    answerToTask(@Request() req: iRequestData, @Body() dto: AnswerDto) {
        return this.taskService.answerToTask(req.user, dto);
    }

    @Get(':id')
    getTask(@Param('id') id: number) {
        return this.taskService.getTaskById(id);
    }

    @Post('delete/:id')
    deleteTask(@Param('id') id: number) {
        return this.taskService.deleteTask(id);
    }



}
