import {
  Controller,
  // Get,
  // Post,
  // Patch,
  // Delete,
} from '@nestjs/common';
// import {
//   ApiTags,
//   ApiBody,
//   ApiParam,
//   ApiOperation,
//   ApiQuery,
// } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'create_user' })
  create(@Payload() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @MessagePattern({ cmd: 'find_all' })
  findAll(@Payload() paginationDto: PaginationDto) {
    console.log('Pagination DTO:', paginationDto);
    return this.userService.findAll(paginationDto);
  }

  @MessagePattern({ cmd: 'find_user' })
  findOne(@Payload('id') id: string) {
    return this.userService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_user' })
  update(@Payload() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }

  @MessagePattern({ cmd: 'delete_user' })
  remove(@Payload('id') id: string) {
    return this.userService.remove(id);
  }
}
