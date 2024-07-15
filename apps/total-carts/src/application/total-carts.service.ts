import { Injectable } from '@nestjs/common';
import Product from '../../../../libs/shared/src/application/product/prouctdto';

@Injectable()
export class TotalCartsService {
  getTotal(products: Product[]): number {
    return products.reduce((previous: number, current: Product) => previous + current.price, 0);
  }
}
