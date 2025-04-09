import { Test, TestingModule } from '@nestjs/testing';
import { PatientProfilesController } from './patient-profiles.controller';
import { PatientProfilesService } from './patient-profiles.service';

describe('PatientProfilesController', () => {
  let controller: PatientProfilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientProfilesController],
      providers: [PatientProfilesService],
    }).compile();

    controller = module.get<PatientProfilesController>(PatientProfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
