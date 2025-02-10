import { Controller, Post, Body, HttpCode, Get, Param, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { User } from './schemas/user.schema';
import { UserDto } from './dto/user-dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Create User' })
  @Post()
  @HttpCode(200)
  async createUser(@Body() createUserDto: UserDto) {
    const user = await this.userService.createUser(createUserDto);
    return { user };
  }

  @ApiOperation({ summary: 'Find User by ID' })
  @Get(':id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return { user };
  }

  @ApiOperation({ summary: 'Update User by ID' })
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: Partial<User>) {
    const user = await this.userService.updateUserById(id, updateUserDto);
    if (!user) {
      throw new Error('User not found');
    }
    return { user };
  }

  @ApiOperation({ summary: 'Delete User by ID' })
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const user = await this.userService.deleteUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return { user };
  }
}
