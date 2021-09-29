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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { diskStorage } from 'multer';
import * as path from 'path';

import { GetUser } from 'src/auth/get-user.decorator';
import { UserService } from './user.service';
import { UserDto } from './user.dto';
import { User } from './user.entity';
import { FileInterceptor } from '@nestjs/platform-express';

let storage = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
      let fileExt = path.extname(file.originalname);
      cb(null, 'user-' + Date.now() + fileExt);
    },
  }),
};
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @UseInterceptors(FileInterceptor('profileImage', storage))
  async createUser(
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: UserDto,
    @GetUser() currentUser: User,
  ) {
    const payLoadWithProfileImage = { ...payload, profileImage: file.filename };
    return await this.userService.create(payLoadWithProfileImage, currentUser);
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
