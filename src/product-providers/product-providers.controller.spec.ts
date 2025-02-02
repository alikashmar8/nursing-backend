import { Test, TestingModule } from '@nestjs/testing';
import { ProductProvidersController } from './product-providers.controller';
import { ProductProvidersService } from './product-providers.service';

describe('ProductProvidersController', () => {
  let controller: ProductProvidersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductProvidersController],
      providers: [ProductProvidersService],
    }).compile();

    controller = module.get<ProductProvidersController>(ProductProvidersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
