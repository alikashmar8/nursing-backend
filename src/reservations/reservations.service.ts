import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { ReservationStatus } from './../common/enums/reservation-status.enum';
import { UserRole } from './../common/enums/user-role.enum';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { CancelReservationDTO } from './dto/cancel-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
  ) {}

  async create(createReservationDto: CreateReservationDto) {
    const reservation =
      this.reservationsRepository.create(createReservationDto);
    return await this.reservationsRepository.save(reservation);
  }

  async findAll(
    filters: {
      take: number;
      skip: number;
      search?: string;
      status?: ReservationStatus;
      customerId?: string;
      nurseId?: string;
      isPaid?: boolean;
    },
    currentUser: User,
  ) {
    const take = filters.take || 20;
    const skip = filters.skip || 0;

    if (currentUser.role === UserRole.CUSTOMER)
      filters.customerId = currentUser.id;

    if (currentUser.role === UserRole.NURSE) filters.nurseId = currentUser.id;

    const reservationsQuery =
      await this.reservationsRepository.createQueryBuilder('reservation');
    reservationsQuery.leftJoinAndSelect('reservation.customer', 'customer');
    reservationsQuery.leftJoinAndSelect(
      'reservation.reservationType',
      'reservationType',
    );
    reservationsQuery.leftJoinAndSelect('reservation.nurse', 'nurse');
    reservationsQuery.leftJoinAndSelect('reservation.address', 'address');

    if (filters.customerId)
      reservationsQuery.andWhere('reservation.customerId = :customerId', {
        customerId: filters.customerId,
      });

    if (filters.nurseId)
      reservationsQuery.andWhere('reservation.nurseId = :nurseId', {
        nurseId: filters.nurseId,
      });

    if (filters.status)
      reservationsQuery.andWhere('reservation.status = :status', {
        status: filters.status,
      });

    if (filters.isPaid != null) {
      if (typeof filters.isPaid == 'string') {
        if (filters.isPaid == 'true') {
          filters.isPaid = true;
        } else if (filters.isPaid == 'false') {
          filters.isPaid = false;
        }
      }

      reservationsQuery.andWhere('req.isPaid = :isPaid', {
        isPaid: filters.isPaid,
      });
    }

    if (filters.search) {
      reservationsQuery.andWhere(
        `reservationType.name ILIKE :search 
        OR address.description ILIKE :search 
        OR customer.firstName ILIKE :search 
        OR customer.lastName ILIKE :search 
        OR customer.phoneNumber ILIKE :search`,
        { search: `%${filters.search}%` },
      );
    }

    reservationsQuery.orderBy('reservation.createdAt', 'DESC');
    reservationsQuery.take(take);
    reservationsQuery.skip(skip);

    const [reservations, count] = await reservationsQuery.getManyAndCount();

    return { data: reservations, count };
  }

  async findOne(id: string, relations?: string[]) {
    return await this.reservationsRepository
      .findOneOrFail({
        where: {
          id,
        },
        relations: relations,
      })
      .catch((e) => {
        console.error(e);
        throw new Error('Reservation not found');
      });
  }

  async update(id: string, updateReservationDto: UpdateReservationDto) {
    return await this.reservationsRepository.update(id, updateReservationDto);
  }

  async cancelReservation(
    id: string,
    cancelReservationDto: CancelReservationDTO,
  ) {
    return await this.reservationsRepository.update(id, {
      ...cancelReservationDto,
      status: ReservationStatus.CANCELLED,
    });
  }
}
