/* eslint-disable prettier/prettier */ 
import { MartialStatus } from 'src/common/enums/martial-status.enum';
import { PrefferedLanguage } from 'src/common/enums/PrefferedLanguage.enum';
import { UserGender } from 'src/common/enums/user-gender.enum';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { CreatePatientProfilesDto } from '../dto/create-patient-profiles.dto';

@Entity('patient_profiles')
export class PatientProfiles  {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'firstname', nullable: false })
  firstName: string;

  @Column({ name: 'lastname', nullable: false })
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

  @Column({ name: 'email', nullable: true, unique: false })
  email?: string;

  @Column({ name: 'phoneNumber', nullable: false})
  phoneNumber: number;

  @Column({ name: 'emergencyNumber', nullable: false})
  emergencyNumber: number;

  @ManyToOne(() => User, (user) => user.patientProfiles)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ name: 'userId', nullable: false })
  userId: string;

  @OneToMany(() => Reservation, (reservation) => reservation.patientProfiles)
  reservations: Reservation[];
}
