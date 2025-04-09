import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { User } from 'src/users/entities/user.entity';
import { CreatePatientProfileDTO } from './dto/create-patient-profile.dto';
import { UpdatePatientProfileDTO } from './dto/update-patient-profile.dto';
import { PatientProfilesService } from './patient-profiles.service';

@ApiTags('Patient Profiles')
@UsePipes(new ValidationPipe({ transform: true }))
@Controller('patient-profiles')
export class PatientProfilesController {
  constructor(
    private readonly patientProfilesService: PatientProfilesService,
  ) {}

  @Roles(UserRole.CUSTOMER)
  @UseGuards(RolesGuard)
  @Post()
  async create(
    @Body() createPatientProfilesDto: CreatePatientProfileDTO,
    @CurrentUser() user: User,
  ) {
    createPatientProfilesDto.userId = user.id;
    return await this.patientProfilesService.create(createPatientProfilesDto);
  }

  @Roles(UserRole.CUSTOMER)
  @UseGuards(RolesGuard)
  @Get()
  async findAll(@CurrentUser() user: User) {
    return await this.patientProfilesService.findAll({ userId: user.id });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    const patientProfile = await this.patientProfilesService.findOneOrFail(id);
    if (patientProfile.userId !== user.id) {
      throw new BadRequestException('You are not authorized to access this profile');
    }
    return patientProfile;
  }

  @Roles(UserRole.CUSTOMER)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() updatePatientProfileDto: UpdatePatientProfileDTO,
  ) {
    const patientProfile = await this.patientProfilesService.findOneOrFail(id);
    if (patientProfile.userId !== user.id) {
      throw new BadRequestException('You are not authorized to update this profile');
    }
    updatePatientProfileDto.userId = user.id;
    return await this.patientProfilesService.update(
      id,
      updatePatientProfileDto,
    );
  }

  @Roles(UserRole.CUSTOMER)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    const patientProfile = await this.patientProfilesService.findOneOrFail(id);
    if (patientProfile.userId !== user.id) {
      throw new Error('You are not authorized to delete this profile');
    }
    return await this.patientProfilesService.remove(id).catch((err) => {
      console.log(err);
      throw new BadRequestException('Error deleting patient profile!');
    });
  }
}
