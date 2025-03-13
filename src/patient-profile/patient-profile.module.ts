import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientProfileService } from './patient-profile.service';
import { PatientProfileController } from './patient-profile.controller';
import { PatientProfile } from './entities/patient-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PatientProfile])], // ✅ Ensure repository is imported
  controllers: [PatientProfileController],
  providers: [PatientProfileService],
  exports: [TypeOrmModule], // ✅ Export it if needed in another module
})
export class PatientProfileModule {}
