import { forwardRef, Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { FileModule } from '../file/file.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { UserModule } from '../user/user.module';
import { TasksForTeam } from './tasks-for-team.entity';
import { TeamModule } from '../team/team.module';
import { TaskGateway } from './task.gateway';

@Module({
    controllers: [TaskController],
    providers: [TaskService, TaskGateway],
    imports: [
        FileModule,
        TypeOrmModule.forFeature([Task, TasksForTeam]),
        forwardRef(() => UserModule),
        forwardRef(() => TeamModule)],
    exports: [TaskService]
})
export class TaskModule {
}
