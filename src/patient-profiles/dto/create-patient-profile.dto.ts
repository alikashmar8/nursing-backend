import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  Length,
} from 'class-validator';
import { UserGender } from 'src/common/enums/user-gender.enum';
import { BloodType } from '../../common/enums/blood-type.enum';

export class CreatePatientProfileDTO {
  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 64)
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 64)
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  dateOfBirth: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(UserGender)
  gender: UserGender;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(BloodType)
  bloodType: BloodType;

  @ApiProperty()
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber: string;

  userId: string;
}
