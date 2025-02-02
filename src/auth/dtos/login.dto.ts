import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsPhoneNumber, Length } from 'class-validator';
import { passwordRegex } from 'src/common/constants';

export class LoginDTO {

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsPhoneNumber()
  @Length(6)
  phoneNumber?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @Length(6)
  fcmToken?: string;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @Length(6)
  deviceId?: string;

  @ApiProperty({
    type: String,
    description: `${passwordRegex}`,
  })
  // @Matches(passwordRegex, { message: 'Weak password' })
  @IsNotEmpty()
  @Length(6, 32)
  password: string;

  deviceInfo?: {
    platform: string;
    isMobile: boolean;
    browser: string;
    version: string;
    os: string;
    source: string;
  };
}
