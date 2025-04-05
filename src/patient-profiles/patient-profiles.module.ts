import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientProfilesService } from './patient-profiles.service';
import { PatientProfilesController } from './patient-profiles.controller';
import { PatientProfiles } from './entities/patient-profiles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PatientProfiles])], 
  controllers: [PatientProfilesController],
  providers: [PatientProfilesService],
  // exports: [TypeOrmModule], 
})
export class PatientProfileModule {}
