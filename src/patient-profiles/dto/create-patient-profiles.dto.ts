import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  isNotEmpty,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { UserGender } from 'src/common/enums/user-gender.enum';

export class CreatePatientProfilesDto {
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
    gender: UserGender;

    @ApiProperty({
      required: false,
      nullable: true,
    })
    @IsOptional()
    @IsEmail()
    email?: string;
  
    @ApiProperty()
    @IsNotEmpty()
    @Length(6, 15)
    phoneNumber: string;

    @ApiProperty()
    @IsNotEmpty()
    @Length(6, 15)
    emergencyNumber: string;

    userId: String;

}
