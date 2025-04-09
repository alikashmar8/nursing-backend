import { UserGender } from 'src/common/enums/user-gender.enum';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BloodType } from '../../common/enums/blood-type.enum';

@Entity('patient_profiles')
export class PatientProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'firstName', nullable: false })
  firstName: string;

  @Column({ name: 'lastName', nullable: false })
  lastName: string;

  @Column({ name: 'dateOfBirth', nullable: false })
  dateOfBirth: Date;

  @Column({
    name: 'gender',
    type: 'enum',
    enum: UserGender,
    nullable: false,
  })
  gender: UserGender;

  @Column({
    name: 'bloodType',
    type: 'enum',
    enum: BloodType,
    nullable: false,
  })
  bloodType: BloodType;

  @Column({ name: 'phoneNumber', nullable: true })
  phoneNumber?: string;

  @Column({ name: 'userId', nullable: false })
  userId: string;

  @ManyToOne(() => User, (user) => user.patientProfiles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Reservation, (reservation) => reservation.patientProfiles)
  reservations: Reservation[];
}
