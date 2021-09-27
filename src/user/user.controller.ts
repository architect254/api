import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from './user.service';
import { UserDto } from './user.dto';

import { GetUser } from 'src/auth/get-user.decorator';
import { User } from './user.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() payload: UserDto, @GetUser() currentUser: User) {
    return await this.userService.create(payload, currentUser);
  }

  @Get('/:id')
  async getUser(@Param('id') id) {
    return await this.userService.read(id);
  }

  @Get()
  async getAllUsers(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.userService.readAll(page, pageSize);
  }

  @Put('/:id')
  async updateUser(
    @Param('id') id,
    @Body() payload: UserDto,
    @GetUser() currentUser: User,
  ) {
    return await this.userService.update(id, payload, currentUser);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id) {
    await this.userService.drop(id);
  }
}
