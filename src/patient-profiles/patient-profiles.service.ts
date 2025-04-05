import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientProfiles } from './entities/patient-profiles.entity';
import { CreatePatientProfilesDto } from './dto/create-patient-profiles.dto';
import { UpdatePatientProfilesDto } from './dto/update-patient-profiles.dto';

@Injectable()
export class PatientProfilesService {
  constructor(
    @InjectRepository(PatientProfiles)
    private readonly patientProfileRepository: Repository<PatientProfiles>,
  ) {}

  async create(data: CreatePatientProfilesDto, id: string) {
    const patientData = {
      firstName: data.firstName, 
      lastName: data.lastName, 
      email: data.email,
      phoneNumber: +data.phoneNumber,
      emergencyNumber: +data.emergencyNumber,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      userId: id
    };
    const patient = this.patientProfileRepository.create(patientData);
    console.log(patient);
    return await this.patientProfileRepository.save(patient).catch((err)=>{
      console.log(err);
      throw new BadRequestException('Error creating patient');
    })
  }

  async findAll() {
    return await this.patientProfileRepository.find();
  }

  async findOne(id: string) {
    return await this.patientProfileRepository.findOne({ where: { id } })
  }

  async findOneOrFail(id: string) {
      return await this.patientProfileRepository.findOne({ where: { id } }).catch((err)=>{
        console.log(err);
        throw new BadRequestException('Error fetching patient');
      }) 
  }

  async update(id: string, data: UpdatePatientProfilesDto) {
    const patientData = {
      firstName: data.firstName, 
      lastName: data.lastName, 
      email: data.email,
      phoneNumber: +data.phoneNumber,
      emergencyNumber: +data.emergencyNumber,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
    };
    await this.patientProfileRepository.update(id, patientData);
    return await this.findOne(id).catch((err)=>{
      console.log(err);
      throw new BadRequestException('Error Updating patient');
    }) 
  }

  async remove(id: string) {
    await this.patientProfileRepository.delete(id).catch((err)=>{
      console.log(err);
      throw new BadRequestException('Error Deleting patient');
    }) 
  }
}