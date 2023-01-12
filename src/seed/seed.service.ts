import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  async runSeed() {
    const ok = await this.insertNewProducts();
    return { massage: 'generate seed', ok };
  }

  private async insertNewProducts() {
    try {
      await this.productsService.deleteAllProducts();
      const products = initialData.products;
      const insertPromises = [];
      // products.forEach((product) => {
      //   insertPromises.push(this.productsService.create(product));
      // });
      await Promise.allSettled(insertPromises);
      return true;
    } catch (error) {
      return false;
    }
  }
}
