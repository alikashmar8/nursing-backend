import { Test, TestingModule } from '@nestjs/testing';
import { ProductStockTransactionsService } from './product-stock-transactions.service';

describe('ProductStockTransactionsService', () => {
  let service: ProductStockTransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductStockTransactionsService],
    }).compile();

    service = module.get<ProductStockTransactionsService>(ProductStockTransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
