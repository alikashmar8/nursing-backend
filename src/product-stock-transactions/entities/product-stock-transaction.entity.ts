import { BaseEntity } from 'src/common/entities/base-entity.entity';
import { Product } from 'src/products/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductProvider } from './../../product-providers/entities/product-provider.entity';

@Entity('product_stock_transactions')
export class ProductStockTransaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'productId', nullable: false })
  productId: string;

  @Column({ name: 'quantity', nullable: false })
  quantity: number;

  @Column({ name: 'cost', nullable: false })
  cost: number;

  @Column({ name: 'productProviderId', nullable: false })
  productProviderId: string;

  @ManyToOne(
    (type) => ProductProvider,
    (productProvider) => productProvider.stockTransactions,
  )
  @JoinColumn({ name: 'productProviderId' })
  productProvider: ProductProvider;

  @ManyToOne((type) => Product, (product) => product.stockTransactions)
  @JoinColumn({ name: 'productId' })
  product: Product;
}
