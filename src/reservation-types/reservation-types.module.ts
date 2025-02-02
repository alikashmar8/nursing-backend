import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { ReservationType } from './entities/reservation-type.entity';
import { ReservationTypesController } from './reservation-types.controller';
import { ReservationTypesService } from './reservation-types.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReservationType, User, DeviceToken])],
  controllers: [ReservationTypesController],
  providers: [ReservationTypesService, UsersService],
})
export class ReservationTypesModule {}
