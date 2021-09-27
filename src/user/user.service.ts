import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare, hash, genSalt } from 'bcrypt';

import { User } from './user.entity';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(credentials: UserDto, currentUser: User): Promise<User> {
    const { name, email, password } = credentials;
    const user = new User();

    user.name = name;
    user.email = email;
    user.createdBy = currentUser;
    user.salt = await genSalt();
    user.password = await hash(password, user.salt);

    return await this.save(user);
  }

  async read(id): Promise<User> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .where('user.id =:id', { id })
      .leftJoinAndSelect('user.createdBy', 'createdBy')
      .leftJoinAndSelect('user.updatedBy', 'updatedBy')
      .getOne();

    if (!user || !Object.keys(user).length) {
      const errorMessage = `user:${id} not found`;
      throw new NotFoundException(errorMessage);
    }

    return user;
  }

  async readAll(page: number, pageSize: number): Promise<User[]> {
    const skip: number = pageSize * (page - 1);

    return await this.userRepo.find({ skip, take: pageSize });
  }

  async update(id, payload: UserDto, currentUser:User): Promise<User> {
    const { name, email } = payload;
    const user: User = await this.read(id);

    user.name = name || user.name;
    user.email = email || user.email;
    user.updatedBy = currentUser;

    return await this.userRepo.save(user);
  }

  async drop(id): Promise<any> {
    const user: User = await this.read(id);
    const result = await this.userRepo.remove(user);

    if (!result) {
      const errorMessage = `failed to delete user:${user.id}`;
      throw new InternalServerErrorException(errorMessage);
    }

    return id;
  }

  async save(user: User): Promise<User> {
    try {
      return await this.userRepo.save(user);
    } catch (error) {
      if (error.errno === 1062) {
        throw new ConflictException('user already exists');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }
}
