import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateReservationTypeDto {
  @ApiProperty({
    required: true,
    nullable: false,
    description: 'Name of the reservation type',
    example: 'Multi Shifts',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'Description of the reservation type',
    example: 'This is a multi shift reservation type',
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'Is the reservation type active?',
    example: true,
  })
  @IsOptional()
  isActive: boolean;

  @ApiProperty({
    required: true,
    nullable: false,
    description: 'Is the reservation type multiple shifts?',
    example: true,
  })
  @IsNotEmpty()
  isMultipleShifts: boolean;
}
