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
import { CreatePatientProfileDto } from '../dto/create-patient-profile.dto';

@Entity('patient_profile')
export class PatientProfile  {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'firstname', nullable: false })
  firstname: string;

  @Column({ name: 'midname', nullable: false })
  midname: string;

  @Column({ name: 'lastname', nullable: false })
  lastname: string;

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

  @Column({ name: 'phoneNumber', nullable: false, unique: true })
  phoneNumber: number;

  @Column({ name: 'emergencyNumber', nullable: false, unique: true })
  emergencyNumber: number;

  
  //enum should be added
  // @Column({
  //   name: 'martial-status',
  //   type: 'enum',
  //   enum: MartialStatus,
  //   nullable: false,
  // })
  // martial_status: MartialStatus;

  //enum should be added 
  // @Column({
  //   name: 'language',
  //   type: 'enum',
  //   enum: PrefferedLanguage,
  //   nullable: false,
  // })
  // language: PrefferedLanguage;



  @ManyToOne(() => User, (user) => user.patientProfiles)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ name: 'userId', nullable: true })
  userId: string;

  @OneToMany(() => Reservation, (reservation) => reservation.patientProfile)
  reservations: Reservation[];
}
