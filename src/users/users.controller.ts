import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
// import { CreateUserChatDto } from './../chats/dto/create-user-chat.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@UsePipes(new ValidationPipe())
@ApiTags('Users')
@ApiBearerAuth('access_token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  // @Roles(EmployeeRole.ADMIN)
  // @UseGuards(RolesGuard)
  @Get()
  async findAll(
    @Query() queryParams: { take: number; skip: number; search: number },
  ) {
    return await this.usersService.findAll(queryParams);
  }

  // @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOneOrFail(id, ['addresses']);
  }

  // @UseInterceptors(
  //   FileInterceptor(
  //     'photo',
  //     getMulterSettings({ destination: './public/uploads/users' }),
  //   ),
  // )
  // @ApiConsumes('multipart/form-data')
  // @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() photo?: any /* Express.Multer.File,*/,
  ) {
    if (photo) {
      console.log('typeof photo: ', typeof photo);
      updateUserDto.photo = photo.path;
    }
    return await this.usersService.update(id, updateUserDto);
  }

  // @Post(':id/chats')
  // async addNewChat(@Param('id') id: string, @Body() body: CreateUserChatDto) {
  //   return await this.usersService.createChat(body);
  // }

  // // @UseGuards(IsUserGuard)
  // @Get(':id/chats')
  // async getAllChats(@Param('id') id: string, @CurrentUser() user: User) {
  //   return await this.usersService.getUserChats(user.id);
  // }
}
