import { RolesGuard } from './../auth/guards/roles.guard';
import { Roles } from './../common/decorators/roles.decorator';
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
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';
import { UserRole } from 'src/common/enums/user-role.enum';
import { IsLoggedInGuard } from 'src/auth/guards/is-logged-in.guard';

@ApiTags('Orders')
@ApiBearerAuth('access_token')
@UsePipes(new ValidationPipe({ transform: true }))
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles(UserRole.CUSTOMER)
  @UseGuards(RolesGuard)
  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: User,
  ) {
    createOrderDto.userId = user.id;
    return await this.ordersService.create(createOrderDto);
  }

  @Get()
  @UseGuards(IsLoggedInGuard)
  async findAll(
    @Query()
    params: {
      userId?: string;
      search?: string;
      createdAt?: Date;
      take: number;
      skip: number;
    },
    @CurrentUser() user: User,
  ) {
    if (user?.role == UserRole.CUSTOMER) params.userId = user.id;

    return await this.ordersService.findAll(params);
  }

  @UseGuards(IsLoggedInGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.ordersService.findOneByIdOrFail(+id, [
      'orderItems',
      'user',
      'address',
    ]);
  }

  @UseGuards(IsLoggedInGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.ordersService.update(id, updateOrderDto);
  }

  @UseGuards(IsLoggedInGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.ordersService.remove(+id);
  }

  @UseGuards(IsLoggedInGuard)
  @Post('calculate-total')
  async getTotal(@Body() data: CreateOrderDto) {
    return await this.ordersService.calculateTotal(data, data.orderItems);
  }
}
