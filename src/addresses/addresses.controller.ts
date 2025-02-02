import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsLoggedInGuard } from 'src/auth/guards/is-logged-in.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@ApiTags('Addresses')
@ApiBearerAuth('access_token')
@UsePipes(new ValidationPipe())
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @UseGuards(IsLoggedInGuard)
  @Post()
  async create(
    @Body() createAddressDto: CreateAddressDto,
    @CurrentUser() user: User,
  ) {
    let body: CreateUserAddressDto = { ...createAddressDto, userId: user.id };
    return await this.addressesService.create(body);
  }

  @Get()
  @UseGuards(IsLoggedInGuard)
  async findAll(
    @Query()
    params: {
      userId?: string;
    },
    @CurrentUser() user: User,
  ) {
    if (user) {
      params.userId = user.id;
    }
    return await this.addressesService.findAll(params);
  }

  @UseGuards(IsLoggedInGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @CurrentUser() user: User,
    // @CurrentEmployee() employee: Employee,
  ) {
    // if (
    //   employee &&
    //   ![EmployeeRole.ADMIN, EmployeeRole.BRANCH_EMPLOYEE].includes(
    //     employee.role,
    //   )
    // ) {
    //   throw new HttpException(
    //     'You are not allowed to perform this action',
    //     HttpStatus.UNAUTHORIZED,
    //   );
    // }
    // const address = await this.addressesService.findByIdOrFail(id);
    // if (user && address.isUserAddress && address.userId != user.id) {
    //   throw new HttpException(
    //     'You are not allowed to perform this action',
    //     HttpStatus.UNAUTHORIZED,
    //   );
    // }
    return await this.addressesService.update(id, updateAddressDto);
  }

  @UseGuards(IsLoggedInGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
    // @CurrentEmployee() employee: Employee,
  ) {
    return await this.addressesService.remove(id, user);
  }

  @UseGuards(IsLoggedInGuard)
  @Get(':id')
  async getById(id: string) {
    return await this.addressesService.findByIdOrFail(id, ['user']);
  }
}
