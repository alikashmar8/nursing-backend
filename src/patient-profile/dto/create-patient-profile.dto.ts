import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';

export class CreatePatientProfileDto {
    @ApiProperty()
    @IsNotEmpty()
    @Length(3, 64)
    firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    @Length(3, 64)
    midName: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @Length(3, 64)
    lastName: string;

    @ApiProperty({
      required: false,
      nullable: true,
    })
    @IsOptional()
    @IsEmail()
    email?: string;
  
    @ApiProperty()
    @IsNotEmpty()
    @Length(6, 32)
    phoneNumber: number;

    @ApiProperty()
    @IsNotEmpty()
    @Length(6, 32)
    emergenceNumber: number;
}
