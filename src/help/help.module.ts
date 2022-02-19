import { forwardRef, Module } from '@nestjs/common';
import { HelpController } from './help.controller';
import { HelpService } from './help.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Help } from './help.entity';
import { TaskModule } from '../task/task.module';
import { TeamModule } from '../team/team.module';

@Module({
    controllers: [HelpController],
    providers: [HelpService],
    imports: [TypeOrmModule.forFeature([Help]), TaskModule, forwardRef(() => TeamModule)]
})
export class HelpModule {
}
