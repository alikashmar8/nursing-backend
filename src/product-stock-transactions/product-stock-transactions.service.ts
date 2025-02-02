import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductStockTransactionDto } from './dto/create-product-stock-transaction.dto';
import { UpdateProductStockTransactionDto } from './dto/update-product-stock-transaction.dto';
import { ProductStockTransaction } from './entities/product-stock-transaction.entity';

@Injectable()
export class ProductStockTransactionsService {
  constructor(
    @InjectRepository(ProductStockTransaction)
    private productStockTransactionRepository: Repository<ProductStockTransaction>,
  ) {}

  async create(
    createProductStockTransactionDto: CreateProductStockTransactionDto,
  ) {
    return await this.productStockTransactionRepository
      .save(createProductStockTransactionDto)
      .catch((err) => {
        console.log(err);
        throw new Error('Error saving Product Stock Transaction!');
      });
  }

  findAll() {
    return `This action returns all productStockTransactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productStockTransaction`;
  }

  update(
    id: number,
    updateProductStockTransactionDto: UpdateProductStockTransactionDto,
  ) {
    return `This action updates a #${id} productStockTransaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} productStockTransaction`;
  }
}
