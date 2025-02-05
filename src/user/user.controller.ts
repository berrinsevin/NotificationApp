import { Controller, Post, Body, HttpCode, Get, Param, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dto/user-dto';
import { User } from './schemas/user.schema';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Create User' })
  @Post()
  @HttpCode(200)
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto.username, createUserDto.password);
    return { user };
  }

  @ApiOperation({ summary: 'Find User' })
  @Get(':username')
  async findUser(@Param('username') username: string) {
    const user = await this.userService.findUser(username);
    if (!user) {
      throw new Error('User not found');
    }
    return { user };
    //berrin
    //name ile değil id ile arama yap
    //yukardaki dönüş tipini standart hale getir
    //            if (result.statusCode === 202) {
    //  return { message: 'Notification sent successfully', status: 'success' };
    //}
  }

  @ApiOperation({ summary: 'Update User' })
  @Put(':username')
  //berrin
  //burayı düzelt
  //id üzerinden ilerle
  async updateUser(@Param('username') username: string, @Body() updateUserDto: Partial<User>) {
    const user = await this.userService.updateUser(username, updateUserDto);
    if (!user) {
      throw new Error('User not found');
    }
    return { user };
  }

  @ApiOperation({ summary: 'Delete User' })
  @Delete(':username')
  async deleteUser(@Param('username') username: string) {
    const user = await this.userService.deleteUser(username);
    if (!user) {
      throw new Error('User not found');
    }
    return { user };
  }
}
