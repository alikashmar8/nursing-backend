import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

import { DeviceTokenStatus } from '../../common/enums/device-token-status.enum';

export class CreateDeviceTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty()
  @IsOptional()
  deviceId?: string;

  @ApiProperty()
  @IsOptional()
  fcmToken?: string;

  @ApiProperty()
  @IsNotEmpty()
  platform: string;

  @ApiProperty()
  @IsNotEmpty()
  isMobile: boolean;

  @ApiProperty()
  @IsOptional()
  browser?: string;

  @ApiProperty()
  @IsOptional()
  version?: string;

  @ApiProperty()
  @IsNotEmpty()
  os: string;

  @ApiProperty()
  @IsOptional()
  source?: string;

  @ApiProperty({ enum: DeviceTokenStatus, default: DeviceTokenStatus.ACTIVE })
  @IsOptional()
  @IsEnum(DeviceTokenStatus)
  status?: DeviceTokenStatus;

  @ApiProperty({})
  @IsNotEmpty()
  userId: string;
}
