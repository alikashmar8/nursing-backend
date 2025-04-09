import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientProfile } from './entities/patient-profile.entity';
import { PatientProfilesController } from './patient-profiles.controller';
import { PatientProfilesService } from './patient-profiles.service';

@Module({
  imports: [TypeOrmModule.forFeature([PatientProfile])],
  controllers: [PatientProfilesController],
  providers: [PatientProfilesService],
})
export class PatientProfileModule {}
