import { DataSource } from 'typeorm';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './users/entities/user.entity';
import { UserRole } from './common/enums/user-role.enum';
import { ReservationType } from './reservation-types/entities/reservation-type.entity';
import { ProductProvider } from './product-providers/entities/product-provider.entity';
import { UserGender } from './common/enums/user-gender.enum';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private dataSource: DataSource,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('initData')
  async initData() {
    const usersRepository = this.dataSource.manager.getRepository(User);
    const initialAdmin = await usersRepository.findOne({
      where: { role: UserRole.ADMIN },
    });
    if (!initialAdmin) {
      const admin = usersRepository.create({
        email: 'admin@nursing.com',
        password: '12345678',
        phoneNumber: '+96171234567',
        role: UserRole.ADMIN,
        gender: UserGender.MALE,
        isActive: true,
        firstName: 'Admin',
        lastName: 'Admin',
      });
      await usersRepository.save(admin);
    }

    // add reservation types
    const reservationTypesRepository =
      this.dataSource.manager.getRepository(ReservationType);
    const count = await reservationTypesRepository.count();
    if (!count) {
      const reservationTypes = reservationTypesRepository.create([
        {
          name: 'One Time Service',
          description: 'One Time Service',
          isMultipleShifts: false,
          isActive: true,
        },
        {
          name: 'Weekly Service',
          description: 'Weekly Service',
          isMultipleShifts: true,
          isActive: true,
        },
        {
          name: 'Monthly Service',
          description: 'Monthly Service',
          isMultipleShifts: true,
          isActive: true,
        },
      ]);
      await reservationTypesRepository.save(reservationTypes);
    }

    const productProviderRepository =
      this.dataSource.manager.getRepository(ProductProvider);
    const countProductProvider = await productProviderRepository.count();
    if (!countProductProvider) {
      const productProviders = productProviderRepository.create([
        {
          name: 'Provider 1',
        },
      ]);
      await productProviderRepository.save(productProviders);
    }
  }
}
