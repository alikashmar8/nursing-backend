import { Injectable } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { CreateProductProviderDto } from './dto/create-product-provider.dto';
import { UpdateProductProviderDto } from './dto/update-product-provider.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductProvider } from './entities/product-provider.entity';

@Injectable()
export class ProductProvidersService {
  constructor(
    @InjectRepository(ProductProvider)
    private productProviderRepository: Repository<ProductProvider>,
  ) {}

  async findAll(filters: {
    search?: string;
    createdAt?: Date;
    take: number;
    skip: number;
  }) {
    const take = filters.take || 10;
    const skip = filters.skip || 0;

    let query: any = this.productProviderRepository
      .createQueryBuilder('provider')
      .where('provider.id IS NOT NULL');

    if (filters.search) {
      const innerQuery = new Brackets((qb) => {
        qb.where('provider.name like :name', {
          name: `%${filters.search}%`,
        });
      });
      query = query.andWhere(innerQuery);
    }
    query = await query.skip(skip).take(take).getManyAndCount();

    return {
      data: query[0],
      count: query[1],
    };
  }

  async create(createProductProviderDto: CreateProductProviderDto) {
    return await this.productProviderRepository
      .save(createProductProviderDto)
      .catch((err) => {
        console.log(err);
        throw new Error('Error saving Product Provider !');
      });
  }

  async findOne(id: string, relations?: string[]) {
    return await this.productProviderRepository
      .findOneOrFail({
        where: { id },
        relations,
      })
      .catch((err) => {
        console.log(err);
        throw new Error('Product Provider not found!');
      });
  }

  async update(id: string, updateProductProviderDto: UpdateProductProviderDto) {
    return await this.productProviderRepository
      .update(id, updateProductProviderDto)
      .catch((err) => {
        console.log(err);
        throw new Error('Error updating Product Provider!');
      });
  }

  async remove(id: string) {
    const result = await this.productProviderRepository
      .delete(id)
      .catch((err) => {
        console.log(err);
        throw new Error('Error deleting Product Provider!');
      });
    return result;
  }
}
