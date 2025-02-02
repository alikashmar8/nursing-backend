import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceTokensService } from '../device-tokens/device-tokens.service';
import { DeviceToken } from '../device-tokens/entities/device-token.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, DeviceToken])],
  providers: [
    AuthService,
    DeviceTokensService,
    UsersService,
    // AppService,
    // GoogleStrategy,
    // ConfigService,
    // Logger
  ],
  controllers: [AuthController],
})
export class AuthModule {}
