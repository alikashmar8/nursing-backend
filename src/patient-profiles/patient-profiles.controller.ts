import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { PatientProfilesService } from './patient-profiles.service';
import { CreatePatientProfilesDto } from './dto/create-patient-profiles.dto';
import { UpdatePatientProfilesDto } from './dto/update-patient-profiles.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('patient-profiles')
export class PatientProfilesController {
  constructor(private readonly patientProfilesService: PatientProfilesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true })) 
  async create(
    @Body() createPatientProfilesDto: CreatePatientProfilesDto,
    @CurrentUser() user: User,
  ) {
    return await this.patientProfilesService.create(createPatientProfilesDto, user.id);
  }

  @Get()
  findAll() {
    return this.patientProfilesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.patientProfilesService.findOneOrFail(id);
  }

  @Patch()
  @UsePipes(new ValidationPipe({ transform: true })) 
  async update(
    @CurrentUser() user: User, 
    @Body() updatePatientProfileDto: UpdatePatientProfilesDto
  ) {
    return await this.patientProfilesService.update(user.id, updatePatientProfileDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.patientProfilesService.remove(id);
  }
}
