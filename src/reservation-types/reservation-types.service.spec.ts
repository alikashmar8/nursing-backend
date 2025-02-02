import { Test, TestingModule } from '@nestjs/testing';
import { ReservationTypesService } from './reservation-types.service';

describe('ReservationTypesService', () => {
  let service: ReservationTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservationTypesService],
    }).compile();

    service = module.get<ReservationTypesService>(ReservationTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
