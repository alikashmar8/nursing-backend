import { Test, TestingModule } from '@nestjs/testing';
import { PatientProfilesService } from './patient-profiles.service';

describe('PatientProfilesService', () => {
  let service: PatientProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatientProfilesService],
    }).compile();

    service = module.get<PatientProfilesService>(PatientProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
