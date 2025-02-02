import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { ReservationStatus } from '../../common/enums/reservation-status.enum';
import { CreateReservationDto } from './create-reservation.dto';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  status?: ReservationStatus;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  confirmedDate?: Date;
}
