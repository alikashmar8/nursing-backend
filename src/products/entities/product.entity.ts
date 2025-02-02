import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Currency } from '../../common/enums/currency.enum';
import { OrderItem } from '../../orders/entities/order-item.entity';
import { Category } from './../../categories/entities/category.entity';
import { ProductStockTransaction } from './../../product-stock-transactions/entities/product-stock-transaction.entity';
import { ProductImage } from './product-image.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: false, type: 'decimal', default: 0 })
  price: number;

  @Column({
    nullable: false,
    type: 'enum',
    enum: Currency,
    default: Currency.USD,
  })
  currency: Currency;

  @Column({ nullable: false, default: 0 })
  views: number;

  @Column({ name: 'quantity', nullable: true, default: 0 })
  quantity?: number;

  @Column({ nullable: false, default: true })
  isActive: boolean;

  @Column({ nullable: false })
  categoryId: string;

  @OneToMany((type) => ProductImage, (image) => image.product)
  images: ProductImage[];

  @OneToMany((type) => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @ManyToOne((type) => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToMany((type) => ProductStockTransaction, (pst) => pst.product)
  stockTransactions: ProductStockTransaction[];

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
