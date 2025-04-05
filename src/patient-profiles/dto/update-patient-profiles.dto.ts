import { PartialType } from '@nestjs/swagger';
import { CreatePatientProfilesDto } from './create-patient-profiles.dto';

export class UpdatePatientProfilesDto extends PartialType(CreatePatientProfilesDto) {}
