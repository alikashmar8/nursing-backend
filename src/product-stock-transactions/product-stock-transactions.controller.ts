import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductStockTransactionsService } from './product-stock-transactions.service';
import { CreateProductStockTransactionDto } from './dto/create-product-stock-transaction.dto';
import { UpdateProductStockTransactionDto } from './dto/update-product-stock-transaction.dto';

@Controller('product-stock-transactions')
export class ProductStockTransactionsController {
  constructor(
    private readonly productStockTransactionsService: ProductStockTransactionsService,
  ) {}

  // @Post()
  // create(@Body() createProductStockTransactionDto: CreateProductStockTransactionDto) {
  //   return this.productStockTransactionsService.create(createProductStockTransactionDto);
  // }

  // @Get()
  // findAll() {
  //   return this.productStockTransactionsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.productStockTransactionsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductStockTransactionDto: UpdateProductStockTransactionDto) {
  //   return this.productStockTransactionsService.update(+id, updateProductStockTransactionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.productStockTransactionsService.remove(+id);
  // }
}
