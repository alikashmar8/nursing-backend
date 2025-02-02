import { User } from 'src/users/entities/user.entity';
import { CurrentUser } from './../common/decorators/current-user.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserRole } from '../common/enums/user-role.enum';
import { RolesGuard } from './../auth/guards/roles.guard';
import { Roles } from './../common/decorators/roles.decorator';
import { CreateProductProviderDto } from './dto/create-product-provider.dto';
import { UpdateProductProviderDto } from './dto/update-product-provider.dto';
import { ProductProvidersService } from './product-providers.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('access_token')
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags('Product Providers')
@Controller('product-providers')
export class ProductProvidersController {
  constructor(
    private readonly productProvidersService: ProductProvidersService,
  ) {}

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() createProductProviderDto: CreateProductProviderDto) {
    return await this.productProvidersService.create(createProductProviderDto);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiQuery({ name: 'search' })
  @Get()
  async findAll(
    @Query()
    params: {
      search?: string;
      createdAt?: Date;
      take: number;
      skip: number;
    },
    @CurrentUser() user: User,
  ) {
    return await this.productProvidersService.findAll(params);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productProvidersService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductProviderDto: UpdateProductProviderDto,
  ) {
    return await this.productProvidersService.update(
      id,
      updateProductProviderDto,
    );
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.productProvidersService.remove(id);
  }
}
