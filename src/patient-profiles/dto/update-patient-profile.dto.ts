import { PartialType } from '@nestjs/swagger';
import { CreatePatientProfileDTO } from './create-patient-profile.dto';

export class UpdatePatientProfileDTO extends PartialType(
  CreatePatientProfileDTO,
) {}
