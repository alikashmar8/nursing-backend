import { Test, TestingModule } from '@nestjs/testing';
import { ReservationTypesController } from './reservation-types.controller';
import { ReservationTypesService } from './reservation-types.service';

describe('ReservationTypesController', () => {
  let controller: ReservationTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationTypesController],
      providers: [ReservationTypesService],
    }).compile();

    controller = module.get<ReservationTypesController>(ReservationTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
