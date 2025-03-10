import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientProfile } from './entities/patient-profile.entity';
import { CreatePatientProfileDto } from './dto/create-patient-profile.dto';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';

@Injectable()
export class PatientProfileService {
  constructor(
    @InjectRepository(PatientProfile)
    private readonly patientProfileRepository: Repository<PatientProfile>,
  ) {}

  async create(createPatientProfileDto: CreatePatientProfileDto) {
    const patientProfile = this.patientProfileRepository.create(createPatientProfileDto);
    return this.patientProfileRepository.save(patientProfile);
  }

  async findAll() {
    return this.patientProfileRepository.find();
  }

  async findOne(id: string) {
    return this.patientProfileRepository.findOne({ where: { id } });
  }

  async update(id: string, updatePatientProfileDto: UpdatePatientProfileDto) {
    await this.patientProfileRepository.update(id, updatePatientProfileDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.patientProfileRepository.delete(id);
  }
}