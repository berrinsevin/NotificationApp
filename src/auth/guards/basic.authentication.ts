
import { Strategy } from 'passport-strategy';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { LoginUserDto } from 'src/user/dto/user-dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class BasicAuthentication extends PassportStrategy(Strategy, 'basic') {
    constructor(
        private readonly userService: UserService,
    ) {
        super({
            passReqToCallback: true
        });
    }

    public validate = async (userDto: LoginUserDto): Promise<any> => {
        const user = await this.userService.findUserByMail(userDto.email);
        if (
            user &&
            user.email === userDto.email &&
            user.password === userDto.password
        ) {
            return true        
        }

        throw new UnauthorizedException();
    }
}