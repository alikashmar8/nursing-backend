import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from '../../orders/entities/order-item.entity';
import { ProductStockTransaction } from './../../product-stock-transactions/entities/product-stock-transaction.entity';

@Entity('product_providers')
export class ProductProvider {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'name', nullable: false, unique: true })
  name: string;

  @OneToMany((type) => OrderItem, (orderItem) => orderItem.productProvider)
  orderItems: OrderItem[];

  @OneToMany((type) => ProductStockTransaction, (pst) => pst.product)
  stockTransactions: ProductStockTransaction[];
}
