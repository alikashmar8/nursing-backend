import { Test, TestingModule } from '@nestjs/testing';
import { PatientProfileController } from './patient-profile.controller';
import { PatientProfileService } from './patient-profile.service';

describe('PatientProfileController', () => {
  let controller: PatientProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientProfileController],
      providers: [PatientProfileService],
    }).compile();

    controller = module.get<PatientProfileController>(PatientProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
