import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from 'config/configuration';
import { join } from 'path';

import { AddressesModule } from './addresses/addresses.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { DeviceTokensModule } from './device-tokens/device-tokens.module';
import { OrdersModule } from './orders/orders.module';
import { ProductProvidersModule } from './product-providers/product-providers.module';
import { ProductStockTransactionsModule } from './product-stock-transactions/product-stock-transactions.module';
import { ProductsModule } from './products/products.module';
import { ReservationTypesModule } from './reservation-types/reservation-types.module';
import { ReservationsModule } from './reservations/reservations.module';
import { ShiftsModule } from './shifts/shifts.module';
import { UsersModule } from './users/users.module';
import { PatientProfileModule } from './patient-profiles/patient-profiles.module';
//import { PatientProfileModule } from './patient-profile/patient-profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('database'),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../public'), // added ../ to get one folder back
      serveRoot: '/public/', //last slash is important
    }),
    AddressesModule,
    AuthModule,
    CategoriesModule,
    DeviceTokensModule,
    OrdersModule,
    ProductProvidersModule,
    ProductStockTransactionsModule,
    ProductsModule,
    ReservationTypesModule,
    ReservationsModule,
    ShiftsModule,
    UsersModule,
    PatientProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
