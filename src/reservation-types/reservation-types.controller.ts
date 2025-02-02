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
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

import { IsLoggedInGuard } from '../auth/guards/is-logged-in.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { User } from '../users/entities/user.entity';
import { CreateReservationTypeDto } from './dto/create-reservation-type.dto';
import { UpdateReservationTypeDto } from './dto/update-reservation-type.dto';
import { ReservationTypesService } from './reservation-types.service';

@ApiBearerAuth('access_token')
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags('Reservation Types')
@Controller('reservation-types')
export class ReservationTypesController {
  constructor(
    private readonly reservationTypesService: ReservationTypesService,
  ) {}

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() createReservationTypeDto: CreateReservationTypeDto) {
    return await this.reservationTypesService.create(createReservationTypeDto);
  }

  @UseGuards(IsLoggedInGuard)
  @ApiQuery({ name: 'isActive', example: true, required: false })
  @ApiQuery({ name: 'search', example: 'One Time Service', required: false })
  @Get()
  async findAll(
    @Query()
    queryParams: {
      take: number;
      skip: number;
      search: string;
      isActive: boolean;
    },
    @CurrentUser() loggedInUser: User,
  ) {
    if (loggedInUser.role === UserRole.CUSTOMER) queryParams.isActive = true;
    return await this.reservationTypesService.findAll(queryParams);
  }

  @UseGuards(IsLoggedInGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.reservationTypesService.findOneOrFail(id);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReservationTypeDto: UpdateReservationTypeDto,
  ) {
    return await this.reservationTypesService.update(
      id,
      updateReservationTypeDto,
    );
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.reservationTypesService.remove(id);
  }
}
