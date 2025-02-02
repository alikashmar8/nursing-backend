import {
    IsDateString,
    IsNotEmpty,
    IsNumber
} from 'class-validator';

export class CreateShiftDto {
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @IsNumber()
  @IsNotEmpty()
  total: number;

  @IsNumber()
  @IsNotEmpty()
  nurseRate: number;

  @IsNotEmpty()
  nurseId: string;

  @IsNotEmpty()
  reservationId: string;
}
