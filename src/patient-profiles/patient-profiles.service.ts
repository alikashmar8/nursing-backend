import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePatientProfileDTO } from './dto/create-patient-profile.dto';
import { UpdatePatientProfileDTO } from './dto/update-patient-profile.dto';
import { PatientProfile } from './entities/patient-profile.entity';

@Injectable()
export class PatientProfilesService {
  constructor(
    @InjectRepository(PatientProfile)
    private readonly patientProfileRepository: Repository<PatientProfile>,
  ) {}

  async create(data: CreatePatientProfileDTO) {
    const patient = this.patientProfileRepository.create(data);
    return await this.patientProfileRepository.save(patient).catch((err) => {
      console.log(err);
      throw new BadRequestException('Error creating patient');
    });
  }

  async findAll(filters: { userId: string }) {
    return await this.patientProfileRepository.find({
      where: { userId: filters.userId },
    });
  }

  async findOne(id: string) {
    return await this.patientProfileRepository.findOne({ where: { id } });
  }

  async findOneOrFail(id: string) {
    return await this.patientProfileRepository
      .findOne({ where: { id } })
      .catch((err) => {
        console.log(err);
        throw new BadRequestException('Error fetching patient');
      });
  }

  async update(id: string, data: UpdatePatientProfileDTO) {
    return await this.patientProfileRepository.update(id, data).catch((err) => {
      console.log(err);
      throw new BadRequestException('Error Updating patient');
    });
  }

  async remove(id: string) {
    return await this.patientProfileRepository.delete(id).catch((err) => {
      console.log(err);
      throw new BadRequestException('Error Deleting patient');
    });
  }
}
