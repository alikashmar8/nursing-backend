import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from './../common/services/files-service/files.service';
import { ProductStockTransactionsService } from './../product-stock-transactions/product-stock-transactions.service';

import * as path from 'path';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductQuantityDTO } from './dto/update-product-quantity.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductImage } from './entities/product-image.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    // @InjectRepository(ProductImage)
    // private productImageRepository: Repository<ProductImage>,
    private filesService: FilesService,
    private dataSource: DataSource,
    private productStockTransactionsService: ProductStockTransactionsService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await queryRunner.manager
        .getRepository(Product)
        .save(createProductDto);

      const savedImages = [];
      createProductDto.images.forEach(async (image) => {
        const productImage = await queryRunner.manager
          .getRepository(ProductImage)
          .save({
            image: image,
            productId: product.id,
          });
        savedImages.push(productImage);
      });

      product.images = savedImages;

      // TODO: remove next line -probably not needed-
      await queryRunner.manager.getRepository(Product).save(product);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return product;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException('Error creating product');
    }
  }

  async findAll(queryParams: {
    search?: string;
    isActive?: boolean;
    orderBy?: string;
    orderByDirection?: string;
    take?: number;
    skip?: number;
  }) {
    const take = queryParams.take || 10;
    const skip = queryParams.skip || 0;

    let query: any = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'image')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.id IS NOT NULL');

    if (queryParams.isActive != null) {
      if (typeof queryParams.isActive == 'string') {
        if (queryParams.isActive == 'true') {
          queryParams.isActive = true;
        } else if (queryParams.isActive == 'false') {
          queryParams.isActive = false;
        }
      }
      query = query.andWhere('product.isActive = :isActive', {
        isActive: queryParams.isActive,
      });
    }

    if (queryParams.search) {
      query = query.andWhere('product.name LIKE :search', {
        search: '%' + queryParams.search + '%',
      });
    }

    if (queryParams.orderBy) {
      const { orderBy, orderByDirection } = queryParams;
      const direction =
        orderByDirection && orderByDirection.toLowerCase() == 'asc'
          ? 'ASC'
          : 'DESC';
      query = query.orderBy(orderBy, direction);
    }

    query = await query.skip(skip).take(take).getManyAndCount();

    return {
      data: query[0],
      count: query[1],
    };
  }

  async update(id: string, data: UpdateProductDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const images = data.images;
      delete data.images;
      const productRepository = queryRunner.manager.getRepository(Product);
      const res = await productRepository.update(id, data);

      if (images && images.length > 0) {
        const productImageRepository =
          queryRunner.manager.getRepository(ProductImage);
        const oldImages = await productImageRepository.find({
          where: {
            productId: id,
          },
        });
        oldImages.forEach(async (image) => {
          const imagePath = path.join(process.cwd(), image.image);
          if (imagePath) {
            try {
              await this.filesService.deleteLocalFile(imagePath);
            } catch (err) {
              console.log(err);
            }
          }
        });

        await productImageRepository.delete({
          productId: id,
        });

        const productImages = images.map((image) => ({
          image,
          productId: id,
        }));
        productImageRepository.create(productImages);
        await productImageRepository.save(productImages);
      }

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return res;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException('Error updating product');
    }
  }

  async updateProductView(id: string) {
    const product = await this.findOneByIdOrFail(id);
    product.views++;
    return await this.productRepository.save(product);
  }

  async findOneByIdOrFail(id: string, relations?: string[]) {
    return await this.productRepository
      .findOneOrFail({ where: { id: id }, relations: relations })
      .catch((err) => {
        throw new BadRequestException('Product not found!', err);
      });
  }

  async remove(id: string) {
    try {
      //TODO: delete images
      const product = await this.findOneByIdOrFail(id, ['images']);
      const images = product.images;

      await this.productRepository.softDelete(id).catch((err) => {
        throw new BadRequestException('Error deleting product', err);
      });

      // images.forEach(async (image) => {
      //   const imagePath = path.join(process.cwd(), image.image);
      //   if (imagePath) {
      //     try {
      //       await this.appsService.deleteFile(imagePath);
      //     } catch (err) {
      //       console.error(err);
      //     }
      //   } else {
      //     console.log(`Image ${imagePath} not found`);
      //   }
      // });

      return { message: 'Product deleted successfully' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error deleting product');
    }
  }

  async updateProductQuantity(id: string, data: UpdateProductQuantityDTO) {
    const product = await this.findOneByIdOrFail(id);

    await this.productStockTransactionsService.create({
      productId: id,
      quantity: data.quantity,
      cost: data.cost,
      productProviderId: data.productProviderId,
    });

    const newQuantity = (product.quantity += data.quantity);
    return await this.productRepository.update(id, {
      quantity: newQuantity,
    });
  }

  // async updateImage(id: string, newImages?: any[]) {
  //   const product = await this.productRepository.findOne({
  //     where: { id },
  //     relations: ['images'],
  //   });

  //   if (!product) {
  //     throw new NotFoundException(`Product with ID ${id} not found`);
  //   }

  //   if (newImages && newImages.length > 0) {
  //     // Update the product's images
  //     const newProductImages = newImages.map((image) => {
  //       const productImage = new ProductImage();
  //       productImage.image = image.path;
  //       productImage.product = product;
  //       return productImage;
  //     });
  //     const savedImages =
  //       await this.productImageRepository.save(newProductImages);
  //     product.images = [...product.images, ...savedImages];
  //   }

  //   await this.productRepository.save(product);

  //   // Delete any images that were removed
  //   await this.productImageRepository.delete({
  //     id: Not(In(product.images.map((image) => image.id))),
  //     productId: id,
  //   });
  // }
}
