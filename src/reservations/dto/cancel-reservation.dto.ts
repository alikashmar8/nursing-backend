import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CancelReservationDTO {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  cancelReason: string;
}
