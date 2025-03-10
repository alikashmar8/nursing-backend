import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { Address } from '../../addresses/entities/address.entity';
import { BaseEntity } from '../../common/entities/base-entity.entity';
import { PaymentType } from '../../common/enums/payment-type.enum';
import { ReservationStatus } from '../../common/enums/reservation-status.enum';
import { ReservationType } from '../../reservation-types/entities/reservation-type.entity';
import { User } from '../../users/entities/user.entity';
import { Shift } from './../../shifts/entities/shift.entity';
import { PatientProfile } from 'src/patient-profile/entities/patient-profile.entity';

@Entity('service-requests')
export class Reservation extends BaseEntity {
  @Column({
    name: 'status',
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  @Column({
    name: 'cancelReason',
    type: 'text',
    nullable: true,
  })
  cancelReason?: string;

  @Column({
    name: 'notes',
    type: 'text',
    nullable: true,
  })
  notes?: string;

  @Column({
    name: 'contactNumber',
    nullable: false,
  })
  contactNumber: string;

  @Column({
    name: 'requestedDate',
    nullable: true,
    type: 'timestamp',
  })
  requestedDate?: Date;

  @Column({
    name: 'confirmedDate',
    type: 'timestamp',
    nullable: true,
  })
  confirmedDate?: Date;

  @Column({
    name: 'paymentType',
    type: 'enum',
    enum: PaymentType,
    default: PaymentType.CASH,
  })
  paymentType: PaymentType;

  @Column({
    name: 'total',
    type: 'float',
    nullable: true,
    default: 0,
  })
  total: number;

  @Column({
    name: 'isPaid',
    default: false,
  })
  isPaid: boolean;

  @Column({
    name: 'reservationTypeId',
    nullable: false,
  })
  reservationTypeId: string;

  @Column({
    name: 'customerId',
    nullable: false,
  })
  customerId: string;

  @Column({ name: 'addressId', nullable: false })
  addressId: string;

  @ManyToOne((type) => ReservationType, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'reservationTypeId' })
  reservationType: ReservationType;

  @ManyToOne((type) => User, (user) => user.reservationRequests, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'customerId' })
  customer: User;

  @ManyToOne((type) => Address, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'addressId' })
  address: Address;

  @OneToMany((type) => Shift, (shift) => shift.reservation)
  shifts: Shift[];

  @ManyToOne(() => PatientProfile, (patientProfile) => patientProfile.reservations, {
    nullable: false,
  })
  @JoinColumn({ name: 'patientProfileId' })
  patientProfile: PatientProfile;

  @Column({ name: 'patientProfileId', nullable: false })
  patientProfileId: string;
}
