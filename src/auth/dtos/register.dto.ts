import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  Length,
  ValidateNested,
} from 'class-validator';
import { UserGender } from 'src/common/enums/user-gender.enum';
import { CreateAddressDto } from '../../addresses/dto/create-address.dto';
import { passwordRegex } from '../../common/constants';

export class RegisterCustomerDTO {
  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 64)
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 64)
  lastName: string;

  @ApiProperty({
    type: String,
    description: `${passwordRegex}`,
  })
  // @Matches(passwordRegex, { message: 'Weak password' })
  @IsNotEmpty()
  @Length(6, 32)
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber()
  @Length(6, 32)
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(UserGender)
  gender: UserGender;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  photo?: any;

  @ApiProperty({ type: CreateAddressDto, isArray: true })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateAddressDto)
  addresses: CreateAddressDto[];
}
