import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UserDto } from './dto/user-dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createUser(userDto: UserDto): Promise<any> {
    const existingUser = await this.userModel.findOne({ email: userDto.email }).exec();
    if (existingUser) {
      return { message: 'User with the same email already exists', status: 'error' };
    }

    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const user = new this.userModel({ username: userDto.username, password: hashedPassword, email: userDto.email, phoneNumber: userDto.phoneNumber });
    
    return user.save();
  }

  async findUserByMail(email: string): Promise<User | undefined | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findUserById(id: string): Promise<User | undefined | null> {
    return this.userModel.findById(id).exec();
  }

  async updateUserById(id: string, updateUserDto: Partial<User>): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  async deleteUserById(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}