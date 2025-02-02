import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Shift } from './entities/shift.entity';
import { ShiftsController } from './shifts.controller';
import { ShiftsService } from './shifts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Shift, Reservation, User, DeviceToken])],
  controllers: [ShiftsController],
  providers: [ShiftsService, UsersService],
})
export class ShiftsModule {}
