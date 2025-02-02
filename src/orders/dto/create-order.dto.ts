import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

import { CreateOrderItemDto } from './create-orderItem.dto';

export class CreateOrderDto {
  @ApiProperty({ type: CreateOrderItemDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];

  @IsNotEmpty()
  @ApiProperty({ nullable: false })
  addressId: string;

  //     @ApiProperty({ enum: OrderStatus, default: OrderStatus.PENDING })
  //     @IsNotEmpty()
  //     @IsEnum(OrderStatus)
  //     status: OrderStatus;

  userId: string;
}
