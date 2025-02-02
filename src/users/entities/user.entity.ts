import { UserGender } from './../../common/enums/user-gender.enum';
import * as argon from 'argon2';
import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OneToMany } from 'typeorm/decorator/relations/OneToMany';
import { Address } from '../../addresses/entities/address.entity';
// import { Chat } from '../../chats/entities/chat.entity';
// import { Message } from '../../chats/entities/message.entity';
import { BaseEntity } from '../../common/entities/base-entity.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { DeviceToken } from '../../device-tokens/entities/device-token.entity';
import { Order } from '../../orders/entities/order.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { Shift } from 'src/shifts/entities/shift.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'firstName', nullable: false })
  firstName: string;

  @Column({ name: 'lastName', nullable: false })
  lastName: string;

  @Exclude()
  @Column({ name: 'password', nullable: false })
  password: string;

  @Column({ name: 'email', nullable: true, unique: false })
  email?: string;

  @Column({ name: 'phoneNumber', nullable: false, unique: true })
  phoneNumber: string;

  @Column({ name: 'dateOfBirth', nullable: true })
  dateOfBirth?: Date;

  @Column({ name: 'photo', nullable: true })
  photo?: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Column({
    name: 'gender',
    type: 'enum',
    enum: UserGender,
    nullable: false,
  })
  gender: UserGender;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  emailVerificationDate?: Date;

  @Column({ nullable: true })
  mobileVerificationDate?: Date;

  @Exclude()
  @Column({ nullable: true })
  mobileVerificationCode?: string;

  @Exclude()
  @Column({ nullable: true })
  mobileVerificationCodeExpiry?: Date;

  @Exclude()
  @Column({ nullable: true })
  emailVerificationCode?: string;

  @Exclude()
  @Column({ nullable: true })
  emailVerificationCodeExpiry?: Date;

  @Exclude()
  @Column({ nullable: true })
  passwordResetCode?: string;

  @Exclude()
  @Column({ nullable: true })
  passwordResetExpiry?: Date;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt?: Date;

  @OneToMany((type) => Address, (address) => address.user, { cascade: true })
  addresses: Address[];

  @OneToMany((type) => DeviceToken, (deviceToken) => deviceToken.user, {
    cascade: true,
  })
  deviceTokens: DeviceToken[];

  @OneToMany((type) => Order, (order) => order.user, { cascade: true })
  orders: Order[];

  @Exclude()
  @OneToMany((type) => Reservation, (reservation) => reservation.customer)
  reservationRequests: Reservation[];

  @Exclude()
  @OneToMany((type) => Shift, (shift) => shift.nurse)
  assignedShifts: Shift[];

  // @Exclude()
  // @OneToMany((type) => Message, (message) => message.user)
  // messages: Message[];

  // @Exclude()
  // @OneToMany((type) => Chat, (chat) => chat.user)
  // chats: Chat[];

  @BeforeInsert()
  async hashPassword() {
    const hash = await argon.hash(this.password);
    this.password = hash;
    this.email = this.email ? this.email.toLowerCase() : null;
  }
}
