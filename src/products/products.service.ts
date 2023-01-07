import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(data: CreateProductDto) {
    try {
      const product = this.productRepository.create(data);
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDbException(error);
    }
  }

  async findAll(pagination: PaginationDto) {
    const { limit = 10, offset = 0 } = pagination;

    return await this.productRepository.find({ take: limit, skip: offset });
  }

  async findOne(term: string) {
    let product;

    if (isUUID(term)) {
      product = await this.productRepository.findOne({
        where: { id: term },
      });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
        .where(`UPPER(title) =:title or slug =:slug`, {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .getOne();
    }

    if (!product) {
      throw new NotFoundException(`product with term: ${term} not found`);
    }

    return product;
  }

  async update(id: string, data: UpdateProductDto) {
    try {
      if (data.slug) data.slug = data.slug.replaceAll(' ', '');

      const product = await this.productRepository.preload({ id, ...data });

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
