import { PartialType } from '@nestjs/mapped-types';
import { CreateProductStockTransactionDto } from './create-product-stock-transaction.dto';

export class UpdateProductStockTransactionDto extends PartialType(CreateProductStockTransactionDto) {}
