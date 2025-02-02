import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { getMulterSettings } from 'src/common/utils/functions';
import { User } from 'src/users/entities/user.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { UserRole } from 'src/common/enums/user-role.enum';
import { IsLoggedInGuard } from 'src/auth/guards/is-logged-in.guard';
import { UpdateProductQuantityDTO } from './dto/update-product-quantity.dto';

@ApiTags('Products')
@ApiBearerAuth('access_token')
@Controller('products')
@UsePipes(new ValidationPipe())
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseInterceptors(
    FilesInterceptor(
      'images[]',
      10,
      getMulterSettings({ destination: './public/uploads/products' }),
    ),
  )
  @ApiConsumes('multipart/form-data')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() images: any[],
  ) {
    if (!images || !images.length) {
      throw new BadRequestException('product images are required!');
    } else {
      const imageList = images.map((image) => image.path);
      createProductDto.images = imageList;
    }

    return await this.productsService.create(createProductDto);
  }

  @UseGuards(IsLoggedInGuard)
  @ApiQuery({ name: 'take', example: 10, required: false })
  @ApiQuery({ name: 'skip', example: 0, required: false })
  @ApiQuery({ name: 'search', example: 'Product1', required: false })
  @ApiQuery({ name: 'orderBy', example: '1', required: false })
  @ApiQuery({ name: 'orderByDirection', example: '1', required: false })
  @ApiQuery({ name: 'isActive', example: true, required: false, type: Boolean })
  @Get()
  async findAll(
    @Query()
    query: {
      search?: string;
      isActive?: boolean;
      orderBy?: string;
      orderByDirection?: string;
      take?: number;
      skip?: number;
    },
  ) {
    return await this.productsService.findAll(query);
  }

  @UseGuards(IsLoggedInGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOneByIdOrFail(id, [
      'images',
      'category',
    ]);
  }

  @UseInterceptors(
    FilesInterceptor(
      'images[]',
      10,
      getMulterSettings({ destination: './public/uploads/products' }),
    ),
  )
  @ApiConsumes('multipart/form-data')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() images?: any[],
  ) {
    const imageList = images ? images.map((image) => image.path) : [];
    updateProductDto.images = imageList;
    return await this.productsService.update(id, updateProductDto);
  }

  // @UseGuards(IsUserGuard)
  // @Patch(':id/views')
  // async updateProductView(@Param('id') id: string, @CurrentUser() user: User) {
  //   return await this.productsService.updateProductView(id);
  // }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id/quantity')
  async updateProductQuantity(
    @Param('id') id: string,
    @Body() data: UpdateProductQuantityDTO,
  ) {
    return await this.productsService.updateProductQuantity(id, data);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const product = await this.findOne(id);
    return await this.productsService.remove(id);
  }
}
