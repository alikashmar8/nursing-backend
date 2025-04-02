import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  Length,
} from 'class-validator';
import { passwordRegex } from 'src/common/constants';
import { UserGender } from 'src/common/enums/user-gender.enum';
import { UserRole } from 'src/common/enums/user-role.enum';

export class CreateUserDto {
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

  @ApiProperty({
    required: false,
    nullable: true,
  })
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
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(UserGender)
  gender: UserGender;

  @ApiProperty()
  @IsOptional()
  // @IsDateString()
  @Type(() => Date)
  dateOfBirth?: Date;
}
