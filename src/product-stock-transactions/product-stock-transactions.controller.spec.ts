import { Test, TestingModule } from '@nestjs/testing';
import { ProductStockTransactionsController } from './product-stock-transactions.controller';
import { ProductStockTransactionsService } from './product-stock-transactions.service';

describe('ProductStockTransactionsController', () => {
  let controller: ProductStockTransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductStockTransactionsController],
      providers: [ProductStockTransactionsService],
    }).compile();

    controller = module.get<ProductStockTransactionsController>(ProductStockTransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
