import { ProductProvider } from 'src/product-providers/entities/product-provider.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    name: 'quantity',
    nullable: false,
  })
  quantity: number;

  @Column({
    name: 'unitPrice',
    nullable: false,
    type: 'decimal',
    default: 0,
  })
  unitPrice: number;

  @Column({
    name: 'unitCost',
    nullable: false,
    type: 'decimal',
    default: 0,
  })
  unitCost: number;

  @Column({
    name: 'isPaidToProvider',
    default: false,
  })
  isPaidToProvider: boolean;

  @Column({
    name: 'orderId',
    nullable: false,
  })
  orderId: number;

  // TODO: check deleting product logic // protect or cascade ?
  @Column({
    name: 'productId',
    nullable: false,
  })
  productId: string;

  @Column({
    name: 'productProviderId',
    nullable: true,
  })
  productProviderId?: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @ManyToOne((type) => Order, (order) => order.orderItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne((type) => Product, (product) => product.orderItems, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(
    (type) => ProductProvider,
    (productProvider) => productProvider.orderItems,
    { onDelete: 'RESTRICT' },
  )
  @JoinColumn({ name: 'productProviderId' })
  productProvider: ProductProvider;
}
