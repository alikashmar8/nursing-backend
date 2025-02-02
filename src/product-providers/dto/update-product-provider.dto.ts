import { PartialType } from '@nestjs/mapped-types';
import { CreateProductProviderDto } from './create-product-provider.dto';

export class UpdateProductProviderDto extends PartialType(CreateProductProviderDto) {}
