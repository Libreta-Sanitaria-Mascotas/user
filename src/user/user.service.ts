import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PaginationDto } from 'src/common';
import { PageResult } from 'src/common/interface/pageResult.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(paginationDto: PaginationDto): Promise<PageResult<User>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;
    const users = await this.userRepository.find({
      skip,
      take: limit,
    });
    const meta = {
      page,
      limit,
      totalItems: await this.userRepository.count(),
      totalPages: Math.ceil((await this.userRepository.count()) / limit),
    };
    return { data: users, meta };
  }

  async findOne(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  async findByCredentialId(credentialId: string) {
    return this.userRepository.findOneBy({ credentialId });
  }

  async update(updateUserDto: UpdateUserDto) {
    const { id, ...data } = updateUserDto;
    if (!id) {
      throw new Error('ID is required for update');
    }
    const userFound = await this.findOne(id);
    if (!userFound) {
      throw new Error('User not found');
    }
    return this.userRepository.save({
      ...userFound,
      ...data,
    });
  }

  async remove(id: string) {
    return this.userRepository.delete(id);
  }
}
