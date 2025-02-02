import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { ProductProvider } from './entities/product-provider.entity';
import { ProductProvidersController } from './product-providers.controller';
import { ProductProvidersService } from './product-providers.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductProvider, User, DeviceToken])],
  controllers: [ProductProvidersController],
  providers: [ProductProvidersService, UsersService],
})
export class ProductProvidersModule {}
