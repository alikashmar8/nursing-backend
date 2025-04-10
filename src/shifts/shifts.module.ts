import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceToken } from '../device-tokens/entities/device-token.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ReservationsService } from './../reservations/reservations.service';
import { Shift } from './entities/shift.entity';
import { ShiftsController } from './shifts.controller';
import { ShiftsService } from './shifts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Shift, Reservation, User, DeviceToken])],
  controllers: [ShiftsController],
  providers: [ShiftsService, UsersService, ReservationsService],
})
export class ShiftsModule {}
