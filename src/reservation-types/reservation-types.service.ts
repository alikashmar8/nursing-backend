import { Brackets, Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReservationTypeDto } from './dto/create-reservation-type.dto';
import { UpdateReservationTypeDto } from './dto/update-reservation-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservationType } from './entities/reservation-type.entity';

@Injectable()
export class ReservationTypesService {
  constructor(
    @InjectRepository(ReservationType)
    private reservationTypesRepository: Repository<ReservationType>,
  ) {}

  create(createReservationTypeDto: CreateReservationTypeDto) {
    const reservationType = this.reservationTypesRepository.create(
      createReservationTypeDto,
    );
    return this.reservationTypesRepository.save(reservationType);
  }

  async findAll(queryParams: {
    take: number;
    skip: number;
    search?: string;
    isActive?: boolean;
  }) {
    const { take, skip, search, isActive } = queryParams;

    const query =
      this.reservationTypesRepository.createQueryBuilder('reservationType');

    if (search) {
      query.where(
        new Brackets((qb) => {
          qb.where('reservationType.name ILIKE :search', {
            search: `%${search}%`,
          });
          qb.orWhere('reservationType.description ILIKE :search', {
            search: `%${search}%`,
          });
        }),
      );
    }

    if (isActive !== undefined && isActive !== null)
      query.andWhere('reservationType.isActive = :isActive', { isActive });

    query.take(take).skip(skip);

    const [data, count] = await query.getManyAndCount();

    return {
      data: data,
      count,
    };
  }

  async findOneOrFail(id: string, relations?: string[]) {
    return await this.reservationTypesRepository
      .findOneOrFail({
        where: { id },
        relations,
      })
      .catch(() => {
        throw new BadRequestException('Reservation type not found');
      });
  }

  async update(id: string, updateReservationTypeDto: UpdateReservationTypeDto) {
    return await this.reservationTypesRepository.update(
      id,
      updateReservationTypeDto,
    );
  }

  async remove(id: string) {
    return await this.reservationTypesRepository.delete(id);
  }
}
