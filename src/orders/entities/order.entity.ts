import { OrderStatus } from 'src/orders/enums/order-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Address } from '../../addresses/entities/address.entity';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: 0 })
  total: number;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  addressId: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: OrderStatus,
  })
  status: OrderStatus;

  @Column({ nullable: true })
  discountAmount?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => User, (user) => user.orders, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne((type) => Address, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'addressId' })
  address: Address;

  @OneToMany((type) => OrderItem, (item) => item.order)
  orderItems: OrderItem[];
}
