import { Controller, Get, Post, Body } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateUpdateGameDto } from './dto/create-update-game.dto';
import { Roles } from '../__shared/decorators/roles.decorator';
import { Role } from '../__shared/enums/enums';

@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService) {}

    @Post('')
    @Roles([Role.Admin])
    updateGame(@Body() dto: CreateUpdateGameDto) {
        return this.gameService.updateGame(dto);
    }

    @Get('')
    getGame() {
        return this.gameService.getGame();
    }
}
