import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';

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
      return true;
    } catch (error) {
      return false;
    }
  }
}
