import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Brackets, DataSource, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderItemDto } from './dto/create-orderItem.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    // @InjectRepository(OrderItem)
    // private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    let items = createOrderDto.orderItems;
    createOrderDto.orderItems = null;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const order = await queryRunner.manager
        .save(Order, createOrderDto)
        .catch((err) => {
          console.log(err);
          throw new BadRequestException('Error saving Order  !');
        });

      //TODO: update product quantity--;
      items = await Promise.all(
        items.map(async (item) => {
          item.orderId = order.id;
          const product = await queryRunner.manager.findOneOrFail(Product, {
            where: { id: item.productId },
          });
          if (product.quantity < item.quantity)
            throw new BadRequestException(
              `Insufficient quantity for: ${product.title}`,
            );

          item.price = product.price;
          await queryRunner.manager.update(Product, product.id, {
            quantity: product.quantity - item.quantity,
          });
          return item;
        }),
      );

      const { total, discountAmount } = await this.calculateTotal(
        createOrderDto,
        items,
      );

      order.total = total;

      if (discountAmount != null) order.discountAmount = discountAmount;

      await queryRunner.manager.save(OrderItem, items).catch((err) => {
        console.log(err);
        throw new BadRequestException('Error adding products!');
      });

      await queryRunner.manager
        .update(
          Order,
          { id: order.id },
          { total: total, discountAmount: order.discountAmount },
        )
        .catch((err) => {
          console.log(err);
          throw new BadRequestException('Error Order Creation!');
        });
      await queryRunner.commitTransaction();
      return order;
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(queryParams: {
    take: number;
    skip: number;
    userId?: string;
    createdAt?: Date;
    search?: string;
  }) {
    const take = queryParams.take || 10;
    const skip = queryParams.skip || 0;

    let query: any = this.ordersRepository
      .createQueryBuilder('order')
      .withDeleted()
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.address', 'address')
      .leftJoinAndSelect('order.orderItems', 'item')
      .leftJoinAndSelect('item.product', 'product')
      .leftJoinAndSelect('product.images', 'image')
      .where('order.id IS NOT NULL');

    if (queryParams.userId) {
      query = query.andWhere('order.userId = :uid', {
        uid: queryParams.userId,
      });
    }

    if (queryParams.createdAt) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      query = query.andWhere('order.createdAt BETWEEN :start AND :end', {
        start: startOfDay,
        end: endOfDay,
      });
    }

    if (queryParams.search) {
      const innerQuery = new Brackets((qb) => {
        qb.where('user.firstName like :name', {
          name: `%${queryParams.search}%`,
        })
          .orWhere('user.lastName like :name', {
            name: `%${queryParams.search}%`,
          })
          .orWhere('user.email like :email', {
            email: `%${queryParams.search}%`,
          })
          .orWhere('order.id like :id', {
            id: `%${queryParams.search}%`,
          })
          .orWhere('order.total like :total', {
            total: `%${queryParams.search}%`,
          })
          .orWhere('order.status like :status', {
            status: `%${queryParams.search}%`,
          })
          .orWhere('order.createdAt like :date', {
            date: `%${queryParams.search}%`,
          });
      });
      query = query.andWhere(innerQuery);
    }

    query = await query
      .orderBy('order.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return {
      data: query[0],
      count: query[1],
    };
  }

  async findOneByIdOrFail(id: number, relations?: string[]) {
    return await this.ordersRepository
      .findOneOrFail({ where: { id: id }, relations })
      .catch((err) => {
        throw new BadRequestException('Order not found!', err);
      });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOneByIdOrFail(+id);

    if (
      updateOrderDto?.status == OrderStatus.CANCELLED &&
      [
        OrderStatus.DELIVERED,
        OrderStatus.REJECTED,
        OrderStatus.REVIEWED,
      ].includes(order?.status)
    ) {
      throw new BadRequestException('Order cannot be cancelled!');
    }

    const updateResult = await this.ordersRepository
      .update(id, updateOrderDto)
      .catch((err) => {
        console.log(err);
        throw new BadRequestException('Error updating order!');
      });

    return updateResult;
  }

  async updateStatus(id: string, status: OrderStatus) {
    return await this.ordersRepository
      .createQueryBuilder()
      .update()
      .set({ status: status })
      .where('id = :id', { id: id })
      .execute()
      .catch((err) => {
        console.log(err);
        throw new BadRequestException('Error updating order status!');
      });
  }

  async remove(id: number) {
    return await this.ordersRepository.delete(id).catch(() => {
      throw new BadRequestException('Error deleting order');
    });
  }

  async calculateTotal(
    orderData: CreateOrderDto,
    items: CreateOrderItemDto[],
  ): Promise<{ total: number; discountAmount: number }> {
    let total = 0;

    items = await Promise.all(
      items.map(async (item) => {
        const product = await this.productsRepository.findOneOrFail({
          where: { id: item.productId },
        });
        item.price = product.price;
        return item;
      }),
    );
    items.forEach((item) => {
      total += item.price * item.quantity;
    });

    //TODO: calculate if there is a discount
    let discountAmount = 0;

    total -= discountAmount;
    return { total, discountAmount };
  }
}
