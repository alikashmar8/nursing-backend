import { BaseEntity } from 'src/common/entities/base-entity.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ShiftStatus } from './../../common/enums/shift-status.enum';
import { Reservation } from './../../reservations/entities/reservation.entity';

@Entity('shifts')
export class Shift extends BaseEntity {
  @Column({
    name: 'startDate',
    nullable: false,
  })
  startDate: Date;

  @Column({
    name: 'endDate',
    nullable: false,
  })
  endDate: Date;

  @Column({
    name: 'checkInDate',
    nullable: true,
  })
  checkInDate?: Date;

  @Column({
    name: 'isCheckInConfirmed',
    default: false,
  })
  isCheckInConfirmed: boolean;

  @Column({
    name: 'checkOutDate',
    nullable: true,
  })
  checkOutDate?: Date;

  @Column({
    name: 'isCheckOutConfirmed',
    default: false,
  })
  isCheckOutConfirmed: boolean;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ShiftStatus,
    default: ShiftStatus.PENDING,
  })
  status: ShiftStatus;

  @Column({
    name: 'total',
    type: 'float',
    nullable: false,
    default: 0,
  })
  total: number;

  @Column({
    name: 'nurseRate',
    type: 'float',
    nullable: false,
    default: 0,
  })
  nurseRate: number;

  @Column({
    name: 'isPaid',
    default: false,
  })
  isPaid: boolean;

  @Column({
    name: 'isPaidForNurse',
    default: false,
  })
  isPaidForNurse: boolean;

  @Column({
    name: 'nurseId',
    nullable: false,
  })
  nurseId: string;

  @Column({
    name: 'reservationId',
    nullable: false,
  })
  reservationId: string;

  @ManyToOne((type) => Reservation, (reservation) => reservation.shifts, {
    onDelete: 'CASCADE',
  })
  reservation: Reservation;

  @ManyToOne((type) => User, (user) => user.assignedShifts, {
    onDelete: 'CASCADE',
  })
  nurse: User;
}
