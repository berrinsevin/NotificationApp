import * as bcrypt from 'bcrypt';
import { BasicStrategy } from 'passport-http';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class BasicAuthentication extends PassportStrategy(BasicStrategy, 'basic') {
    constructor(private readonly userService: UserService) {
        super();
    }

    async validate(username: string, password: string): Promise<any> {
        const user = await this.userService.findUserByMail(username);

        if (user && await bcrypt.compare(password, user.password)){
            return true;
        }
        
        throw new UnauthorizedException();
    }
}
