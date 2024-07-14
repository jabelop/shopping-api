
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ProductRepository } from '../../../../libs/shared/src/domain/product/product.repository';
import ProductDTO from '../../../../libs/shared/src/application/product/prouctdto';
import Product from '../domain/product';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(ProductRepository) private readonly productRepository: ProductRepository
  ) { }


  /**
   * save a product
   * 
   * @param product the product to save
   * 
   * @returns a Promise with true if the product was saved, false it there was an error
   */
  async saveProduct(product: ProductDTO): Promise<boolean> {
    return await this.productRepository.saveProduct(Product.getProductFromDTO(product));
  }

  /**
   * get a product
   * 
   * @param id the id to look for
   * 
   * @returns a Promise with the product if was found, null if not
   */
  async getProduct(id: string): Promise <Product> {
    return await this.productRepository.getProduct(id);
  }

  /**
   * reserve a product
   * 
   * @param id the id to look for
   * 
   * @returns a Promise with true if the product if was reserved, false if it was not
   */
  async reserveProduct(id: string): Promise<boolean> {
    return await this.productRepository.reserveProduct(id);
  }

  /**
   * remove a reserved product
   * 
   * @param id the id to look for
   * 
   * @returns a Promise with true if the product if was removed as reserved, false if it was not
   */
  async removeReservedProduct(id: string): Promise<boolean> {
    return await this.productRepository.removeReservedProduct(id);
  }
}
