import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { User } from 'src/users/entities/user.entity';
import { IsLoggedInGuard } from '../auth/guards/is-logged-in.guard';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsService } from './reservations.service';
import { CancelReservationDTO } from './dto/cancel-reservation.dto';

@ApiBearerAuth('access_token')
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @CurrentUser() loggedInUser: User,
  ) {
    if (loggedInUser.role === UserRole.CUSTOMER)
      createReservationDto.customerId = loggedInUser.id;
    if (loggedInUser.role === UserRole.ADMIN)
      if (!createReservationDto.customerId)
        throw new BadRequestException('Customer is required');
    return await this.reservationsService.create(createReservationDto);
  }

  @UseGuards(IsLoggedInGuard)
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'customerId', required: false })
  @ApiQuery({ name: 'isPaid', required: false })
  @Get()
  async findAll(@Query() query: any, @CurrentUser() loggedInUser: User) {
    return await this.reservationsService.findAll(query, loggedInUser);
  }

  @UseGuards(IsLoggedInGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() loggedInUser: User) {
    const reservation = await this.reservationsService.findOne(id, ['shifts']);
    if (
      loggedInUser.role === UserRole.CUSTOMER &&
      reservation.customerId !== loggedInUser.id
    )
      throw new UnauthorizedException(
        'You are not authorized to view this reservation',
      );
    // if (
    //   loggedInUser.role === UserRole.NURSE &&
    //   reservation.nurseId !== loggedInUser.id
    // )
    //   throw new UnauthorizedException(
    //     'You are not authorized to view this reservation',
    //   );
    return reservation;
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return await this.reservationsService.update(id, updateReservationDto);
  }

  @Roles(UserRole.CUSTOMER)
  @UseGuards(RolesGuard)
  @Patch(':id/cancel')
  async cancel(
    @Param('id') id: string,
    @Body() cancelReservationDto: CancelReservationDTO,
    @CurrentUser() loggedInUser: User,
  ) {
    const reservation = await this.reservationsService.findOne(id);
    if (reservation.customerId !== loggedInUser.id)
      throw new UnauthorizedException(
        'You are not authorized to cancel this reservation',
      );
    return await this.reservationsService.cancelReservation(
      id,
      cancelReservationDto,
    );
  }
}
