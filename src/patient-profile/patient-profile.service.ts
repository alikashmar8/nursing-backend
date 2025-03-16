import { BadRequestException, Injectable } from '@nestjs/common';
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

  async create(data: CreatePatientProfileDto) {
    const patientData = {
      firstname: data.firstName, 
      midname: data.midName, 
      lastname: data.lastName, 
      email: data.email,
      phoneNumber: data.phoneNumber,
      emergencyNumber: data.emergencyNumber,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
    };
    const patient = this.patientProfileRepository.create(patientData);
    console.log(patient);
    return await this.patientProfileRepository.save(patient).catch((err)=>{
      console.log(err);
      throw new BadRequestException('Error creating patient');
    })
  }

  async findAll() {
    return this.patientProfileRepository.find();
  }

  async findOne(id: string) {
    const patient = this.patientProfileRepository.findOne({ where: { id } })
    if(patient){
      return this.patientProfileRepository.findOne({ where: { id } }).catch((err)=>{
        console.log(err);
        throw new BadRequestException('Error fetching patient');
      }) 
    }
    else{
      return null;
    }
  }

  async findOneOrFail(id: string) {
      return this.patientProfileRepository.findOne({ where: { id } }).catch((err)=>{
        console.log(err);
        throw new BadRequestException('Error fetching patient');
      }) 
  }

  async update(id: string, data: UpdatePatientProfileDto) {
    const patientData = {
      firstname: data.firstName, 
      midname: data.midName, 
      lastname: data.lastName, 
      email: data.email,
      phoneNumber: data.phoneNumber,
      emergencyNumber: data.emergencyNumber,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
    };
    await this.patientProfileRepository.update(id, patientData);
    return this.findOne(id).catch((err)=>{
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