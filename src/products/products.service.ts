import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async findOne(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`product with id: ${id} not found`);
    }

    return product;
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
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
