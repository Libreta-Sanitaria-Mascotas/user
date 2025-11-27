import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PaginationDto } from 'src/common';
import { PageResult } from 'src/common/interface/pageResult.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /** Crea un usuario a partir del DTO recibido. */
  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  /** Lista usuarios con paginación básica. */
  async findAll(paginationDto: PaginationDto): Promise<PageResult<User>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;
    const [users, totalItems] = await this.userRepository.findAndCount({
      skip,
      take: limit,
    });
    const totalPages = Math.ceil(totalItems / limit) || 1;
    return {
      data: users,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }

  /** Busca usuario por ID. */
  async findOne(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  /** Busca usuario por credentialId (para gateway/auth). */
  async findByCredentialId(credentialId: string) {
    return this.userRepository.findOneBy({ credentialId });
  }

  /** Actualiza datos de usuario (requiere id). */
  async update(updateUserDto: UpdateUserDto) {
    const { id, ...data } = updateUserDto;
    if (!id) {
      throw new RpcException({
        statusCode: 400,
        message: 'ID is required for update',
      });
    }
    const userFound = await this.findOne(id);
    if (!userFound) {
      throw new RpcException({
        statusCode: 404,
        message: 'User not found',
      });
    }
    return this.userRepository.save({
      ...userFound,
      ...data,
    });
  }

  /** Verifica si el usuario existe (uso cruzado). */
  async validate(id: string): Promise<{ exists: boolean }> {
    const user = await this.userRepository.findOneBy({ id });
    return { exists: !!user };
  }

  /** Elimina usuario por ID. */
  async remove(id: string) {
    const userFound = await this.findOne(id);
    if (!userFound) {
      throw new RpcException({
        statusCode: 404,
        message: 'User not found',
      });
    }
    return this.userRepository.delete(id);
  }
}
