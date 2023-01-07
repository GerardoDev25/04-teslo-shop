import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { Repository } from 'typeorm';

import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductImage } from './entities/product-image.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async create(data: CreateProductDto) {
    try {
      const { images = [], ...rest } = data;

      const product = this.productRepository.create({
        ...rest,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });
      await this.productRepository.save(product);
      return { ...product, images };
    } catch (error) {
      this.handleDbException(error);
    }
  }

  async findAll(pagination: PaginationDto) {
    const { limit = 10, offset = 0 } = pagination;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: { images: true },
    });

    return products.map(({ images, ...rest }) => ({
      ...rest,
      images: images.map((img) => img.url),
    }));
  }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOne({
        where: { id: term },
        // relations: { images: true },
      });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where(`UPPER(title) =:title or slug =:slug`, {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }

    if (!product) {
      throw new NotFoundException(`product with term: ${term} not found`);
    }

    return { ...product, images: product.images.map((img) => img.url) };
  }

  async update(id: string, data: UpdateProductDto) {
    try {
      const product = await this.productRepository.preload({
        id,
        ...data,
        images: [],
      });

      if (!product) {
        throw new NotFoundException(`product with term: ${id} not found`);
      }
      return this.productRepository.save(product);
    } catch (error) {
      this.handleDbException(error);
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      await this.productRepository.delete(id);
      return { ok: true };
    } catch (error) {
      this.handleDbException(error);
    }
  }

  private handleDbException(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException(
      'unexpected error, check server logs',
    );
  }
}
