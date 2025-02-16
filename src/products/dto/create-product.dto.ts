import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Currency } from 'src/common/enums/currency.enum';

export class CreateProductDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'Product title',
  })
  @Length(1, 100)
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Product description',
    example: 'Product description',
    minLength: 1,
    maxLength: 255,
    nullable: true,
  })
  @Length(1, 255)
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: Number,
    required: true,
    example: 100,
  })
  @IsNumberString()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    type: Boolean,
    required: true,
    nullable:false,
    default:true
  })
  isActive:boolean;

  @ApiProperty({
    enum: Currency,
    required: false,
    example: Currency.USD,
    nullable: true,
    default: Currency.USD,
  })
  @IsEnum(Currency)
  @IsOptional()
  currency?: Currency;

  @ApiProperty()
  @IsNotEmpty()
  categoryId:string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  @IsOptional()
  images: any[];
}
