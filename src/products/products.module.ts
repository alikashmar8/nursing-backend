import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from 'src/common/services/files-service/files.service';
import { DeviceTokensService } from 'src/device-tokens/device-tokens.service';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { ProductStockTransaction } from 'src/product-stock-transactions/entities/product-stock-transaction.entity';
import { ProductStockTransactionsService } from 'src/product-stock-transactions/product-stock-transactions.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { ProductImage } from './entities/product-image.entity';
import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      User,
      DeviceToken,
      ProductImage,
      ProductStockTransaction,
    ]),
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    FilesService,
    ProductStockTransactionsService,
    UsersService,
    DeviceTokensService,
  ],
})
export class ProductsModule {}
