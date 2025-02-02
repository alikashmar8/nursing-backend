import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateProductQuantityDTO {
  @ApiProperty()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  cost: number;
  
  @ApiProperty()
  @IsNotEmpty()
  productProviderId: string;
}
