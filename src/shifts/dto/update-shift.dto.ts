import { PartialType } from '@nestjs/mapped-types';
import { CreateShiftDto } from './create-shift.dto';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { ShiftStatus } from 'src/common/enums/shift-status.enum';

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
}
