import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Roles } from '../__shared/decorators/roles.decorator';
import { Role } from '../__shared/enums/enums';
import { iRequestData } from '../__shared/types/types';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Post('register')
    register(@Body() dto: LoginDto) {
        return this.authService.register(dto);
    }

    @Get('me')
    me(@Request() req: iRequestData) {
        return this.authService.me(req.user);
    }
}
