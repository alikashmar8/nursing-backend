import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
// import { CreateUserChatDto } from './../chats/dto/create-user-chat.dto';
import { IsLoggedInGuard } from 'src/auth/guards/is-logged-in.guard';
import { UserRole } from 'src/common/enums/user-role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@UsePipes(new ValidationPipe())
@ApiTags('Users')
@ApiBearerAuth('access_token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // currently this api is used to create admin and nurses only
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.role === UserRole.CUSTOMER) {
      throw new Error('Customers cannot be created here');
    }
    return await this.usersService.create(createUserDto);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  async findAll(
    @Query()
    queryParams: {
      take?: number;
      skip?: number;
      search?: string;
      role: UserRole;
    },
  ) {
    return await this.usersService.findAll(queryParams);
  }

  @UseGuards(IsLoggedInGuard)
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
