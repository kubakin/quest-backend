import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { CreateTokenDto } from './dto/create-token.dto';

@Injectable()
export class AuthService {
    constructor(private userService: UserService,
                private jwtService: JwtService) {
    }

    async validateUser({username, password}) {
        const user = await this.userService.findByUsername(username);
        if (user && user?.password === password) {
            return user
        }
        return null;
    }

    async login(dto: LoginDto) {
        const user = await this.userService.findByUsername(dto.username);
        if(!user) {
            throw new HttpException('Неправильный логин или пароль', HttpStatus.BAD_REQUEST);
        }
        if (user.password !== dto.password) {
            throw new UnauthorizedException();
        }
        const token = this.jwtService.sign({...dto, role: user.role});
        return {token};
    }

    async register(dto: LoginDto) {
        if (await this.userService.findByUsername(dto.username)) {
            throw new HttpException('Пользователь с таким именем уже существует', HttpStatus.BAD_REQUEST)
        }
        const user = await this.userService.create(dto);
        return {token: this.createToken({username: user.username, password: user.password, role: user.role})}
    }

    createToken(dto: CreateTokenDto) {
        const token = this.jwtService.sign(dto);
        return token;
    }

    async me(user) {
        return await user
    }
}
