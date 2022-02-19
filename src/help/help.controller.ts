import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { HelpService } from './help.service';
import { iRequestData } from '../__shared/types/types';
import { CreateHelpDto } from './dto/create-help.dto';

@Controller('help')
export class HelpController {
    constructor(private readonly helpService: HelpService) {
    }
    @Get('/')
    getHelp(@Req() req: iRequestData) {
        return this.helpService.getHelp(req.user);
    }

    @Post('')
    create(@Body() dto: CreateHelpDto) {
        return this.helpService.create(dto);
    }
}
