import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ShiftStatus } from 'src/common/enums/shift-status.enum';
import { CreateShiftDto } from './create-shift.dto';

export class UpdateShiftDto extends PartialType(CreateShiftDto) {
  @IsOptional()
  @IsEnum(ShiftStatus)
  status?: ShiftStatus;

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @IsOptional()
  @IsBoolean()
  isPaidForNurse?: boolean;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  checkInDate?: Date;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  checkOutDate?: Date;
}
