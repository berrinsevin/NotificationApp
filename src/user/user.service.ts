import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createUser(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ username, password: hashedPassword });
    
    return user.save();
  }

  async findUser(username: string): Promise<User | undefined | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async updateUser(username: string, updateUserDto: Partial<User>): Promise<User | null> {
    return this.userModel.findOneAndUpdate({ username }, updateUserDto, { new: true }).exec();
  }

  async deleteUser(username: string): Promise<User | null> {
    return this.userModel.findOneAndDelete({ username }).exec();
  }
}