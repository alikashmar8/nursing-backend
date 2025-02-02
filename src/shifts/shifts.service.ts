import { ShiftStatus } from './../common/enums/shift-status.enum';
// src/shifts/shifts.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservationStatus } from 'src/common/enums/reservation-status.enum';
import { DataSource, Not, Repository } from 'typeorm';
import { Reservation } from '../reservations/entities/reservation.entity';
import { User } from '../users/entities/user.entity';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { Shift } from './entities/shift.entity';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private dataSource: DataSource,
  ) {}

  async create(createShiftDto: CreateShiftDto): Promise<Shift> {
    const startDate = createShiftDto.startDate;
    const endDate = createShiftDto.endDate;
    if (
      !(
        startDate.getFullYear() === endDate.getFullYear() &&
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getDate() === endDate.getDate()
      )
    )
      throw new BadRequestException(
        'Shift start and end date must be on the same day',
      );
    const shift = this.shiftRepository.create(createShiftDto);
    return this.shiftRepository.save(shift);
  }

  async update(id: string, updateShiftDto: UpdateShiftDto): Promise<Shift> {
    const shift = await this.shiftRepository.findOne({
      where: { id },
      relations: ['reservation'],
    });
    if (!shift) throw new NotFoundException(`Shift with ID ${id} not found`);

    // Update shift fields
    Object.assign(shift, updateShiftDto);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const updatedShift = await queryRunner.manager.save(shift);

      // update relative reservation if needed
      if (updateShiftDto.hasOwnProperty('isPaid')) {
        if (!updatedShift.isPaid && shift.reservation.isPaid) {
          await queryRunner.manager
            .getRepository(Reservation)
            .update(shift.reservationId, {
              isPaid: false,
            });
        } else {
          // check if all shifts in a reservation is paid:
          const shifts = await queryRunner.manager.getRepository(Shift).find({
            where: { reservationId: shift.reservationId },
            select: ['id', 'isPaid'],
          });
          const allShiftsPaid = shifts.every((s) => s.isPaid);
          if (allShiftsPaid) {
            await queryRunner.manager
              .getRepository(Reservation)
              .update(shift.reservationId, {
                isPaid: true,
              });
          }
        }
      }

      return updatedShift;
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: string, relations?: string[]): Promise<Shift> {
    const shift = await this.shiftRepository.findOne({
      where: { id },
      relations,
    });
    if (!shift) {
      throw new NotFoundException(`Shift with ID ${id} not found`);
    }
    return shift;
  }

  async findAll(query: {
    take?: number;
    skip?: number;
    nurseId?: string;
    isPaid?: boolean;
    isPaidForNurse?: boolean;
    status?: ShiftStatus;
    startDate?: Date;
    endDate?: Date;
    reservationId?: string;
  }): Promise<{ data: Shift[]; count: number }> {
    const queryBuilder = this.shiftRepository
      .createQueryBuilder('shift')
      .leftJoinAndSelect('shift.reservation', 'reservation')
      .leftJoinAndSelect('shift.nurse', 'nurse');

    // Apply filters dynamically
    if (query.nurseId) {
      queryBuilder.andWhere('shift.nurseId = :nurseId', {
        nurseId: query.nurseId,
      });
    }
    if (query.isPaid !== undefined) {
      queryBuilder.andWhere('shift.isPaid = :isPaid', { isPaid: query.isPaid });
    }
    if (query.isPaidForNurse !== undefined) {
      queryBuilder.andWhere('shift.isPaidForNurse = :isPaidForNurse', {
        isPaidForNurse: query.isPaidForNurse,
      });
    }
    if (query.status) {
      queryBuilder.andWhere('shift.status = :status', { status: query.status });
    }
    if (query.startDate && query.endDate) {
      queryBuilder.andWhere('shift.startDate BETWEEN :startDate AND :endDate', {
        startDate: query.startDate,
        endDate: query.endDate,
      });
    }
    if (query.reservationId) {
      queryBuilder.andWhere('shift.reservationId = :reservationId', {
        reservationId: query.reservationId,
      });
    }

    // Apply pagination
    if (query.take) {
      queryBuilder.take(query.take);
    }
    if (query.skip) {
      queryBuilder.skip(query.skip);
    }

    // Execute the query to get data and count
    const [data, count] = await queryBuilder
      .orderBy('createdAt', 'DESC')
      .getManyAndCount();

    return { data, count };
  }

  async remove(id: string) {
    const shift = await this.shiftRepository.findOne({ where: { id } });
    if (!shift) {
      throw new NotFoundException(`Shift with ID ${id} not found`);
    }
    return await this.shiftRepository.remove(shift);
  }

  async checkIn(
    id: string,
    currentNurse: User,
  ): Promise<Shift | PromiseLike<Shift>> {
    const shift = await this.findOne(id, ['reservation']);
    if (!shift) throw new BadRequestException('Shift not found');
    if (shift.nurseId != currentNurse.id)
      throw new UnauthorizedException(
        'You are not authorized to check in this shift',
      );
    if (
      [
        ShiftStatus.CANCELLED,
        ShiftStatus.COMPLETED,
        ShiftStatus.IN_PROGRESS,
      ].includes(shift.status)
    )
      throw new BadRequestException('Invalid shift status');
    shift.status = ShiftStatus.IN_PROGRESS;
    shift.checkInDate = new Date();
    if (shift.reservation.status != ReservationStatus.IN_PROGRESS)
      await this.reservationRepository.update(shift.reservationId, {
        status: ReservationStatus.IN_PROGRESS,
      });

    return await this.shiftRepository.save(shift);
  }

  async checkOut(id: string, currentNurse: User): Promise<Shift> {
    const shift = await this.findOne(id);

    if (!shift) throw new BadRequestException('Shift not found');
    if (shift.nurseId != currentNurse.id)
      throw new UnauthorizedException(
        'You are not authorized to check out this shift',
      );
    if (
      [
        ShiftStatus.CANCELLED,
        ShiftStatus.COMPLETED,
        ShiftStatus.PENDING,
      ].includes(shift.status)
    )
      throw new BadRequestException('Invalid shift status');

    const pendingShiftsCount = await this.shiftRepository.count({
      where: {
        reservationId: shift.reservationId,
        status: ShiftStatus.PENDING,
        id: Not(shift.id),
      },
    });
    if (pendingShiftsCount === 0) {
      await this.reservationRepository.update(shift.reservationId, {
        status: ReservationStatus.DONE,
      });
    }

    shift.status = ShiftStatus.COMPLETED;
    shift.checkOutDate = new Date();

    return await this.shiftRepository.save(shift);
  }
}
