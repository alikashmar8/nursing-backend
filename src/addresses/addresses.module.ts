import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceToken } from 'src/device-tokens/entities/device-token.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';
import { Address } from './entities/address.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Address,
      User,
      DeviceToken,
      // Employee,
      // Setting,
      // Branch,
      // Chat,
      // Message,
      // Notification,
      // ServiceRequest,
    ]),
  ],
  controllers: [AddressesController],
  providers: [
    AddressesService,
    UsersService,
    // ChatsService,
    // EmployeesService,
    // AppService,
    // BranchesService,
    // NotificationsService,
    // Logger,
  ],
})
export class AddressesModule {}
