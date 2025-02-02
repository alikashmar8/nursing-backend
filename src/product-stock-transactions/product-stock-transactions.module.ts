import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductStockTransaction } from './entities/product-stock-transaction.entity';
import { ProductStockTransactionsController } from './product-stock-transactions.controller';
import { ProductStockTransactionsService } from './product-stock-transactions.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductStockTransaction])],
  controllers: [ProductStockTransactionsController],
  providers: [ProductStockTransactionsService],
})
export class ProductStockTransactionsModule {}
