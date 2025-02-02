import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  reservationTypeId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  contactNumber: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  requestedDate: Date;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  addressId: string;

  // to be filled in code
  @IsOptional()
  customerId: string;
}
