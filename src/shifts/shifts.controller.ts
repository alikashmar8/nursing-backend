import { User } from 'src/users/entities/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from './../auth/guards/roles.guard';
import { Roles } from './../common/decorators/roles.decorator';
import { UserRole } from './../common/enums/user-role.enum';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { Shift } from './entities/shift.entity';
import { ShiftsService } from './shifts.service';
import { IsLoggedInGuard } from 'src/auth/guards/is-logged-in.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ShiftStatus } from 'src/common/enums/shift-status.enum';

@ApiBearerAuth('access_token')
@ApiTags('Shifts')
@UsePipes(new ValidationPipe({ transform: true }))
@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() createShiftDto: CreateShiftDto): Promise<Shift> {
    return await this.shiftsService.create(createShiftDto);
  }

  @UseGuards(IsLoggedInGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Shift> {
    return this.shiftsService.findOne(id);
  }

  @Roles(UserRole.ADMIN, UserRole.NURSE)
  @UseGuards(RolesGuard)
  @Get()
  async findAll(
    @Query()
    query: {
      take?: number;
      skip?: number;
      nurseId?: string;
      isPaid?: boolean;
      isPaidForNurse?: boolean;
      status?: ShiftStatus;
      startDate?: Date;
      endDate?: Date;
      reservationId?: string;
    },
    @CurrentUser() currentUser: User,
  ): Promise<{ data: Shift[]; count: number }> {
    if (currentUser.role == UserRole.NURSE) query.nurseId = currentUser.id;
    return await this.shiftsService.findAll(query);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateShiftDto: UpdateShiftDto,
  ): Promise<Shift> {
    return await this.shiftsService.update(id, updateShiftDto);
  }

  @Roles(UserRole.NURSE)
  @UseGuards(RolesGuard)
  @Patch(':id/checkIn')
  async nurseCheckIn(
    @Param('id') id: string,
    @CurrentUser() currentNurse: User,
  ): Promise<Shift> {
    return await this.shiftsService.checkIn(id, currentNurse);
  }

  @Roles(UserRole.NURSE)
  @UseGuards(RolesGuard)
  @Patch(':id/checkOut')
  async nurseCheckOut(
    @Param('id') id: string,
    @CurrentUser() currentNurse: User,
  ): Promise<Shift> {
    return await this.shiftsService.checkOut(id, currentNurse);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.shiftsService.remove(id);
  }
}
