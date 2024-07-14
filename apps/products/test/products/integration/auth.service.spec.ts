import { Test, TestingModule } from '@nestjs/testing';

import { JwtService } from '@nestjs/jwt';
import { ProductRepository } from '../../../../../libs/shared/src/domain/product/product.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from 'process';
import { UUID } from 'crypto';
import { ProductsService } from '../../../src/application/products.service';
import { ProductsModule } from '../../../src/products.module';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: ProductRepository;
  const id: UUID = "ebf6e8cd-79e3-46d2-9032-3442f4793a04";
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ MongooseModule.forRoot(`mongodb://${env.DB_HOST_TEST}/${env.DB_NAME_TEST}`), ProductsModule],
      providers: [JwtService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<ProductRepository>(ProductRepository);
    productRepository.saveProduct({ id, name: "product14", price: 10, stock: 10, reserved: 2 });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get a product', async () => {
    expect(await productRepository.getProduct(id)).not.toBe(null);
  });

  it('should reserve a product', async () => {
    expect(await productRepository.reserveProduct(id)).toBe(true);
  });

  it('should remove a reserved product', async () => {
    expect(await productRepository.removeReservedProduct(id)).toBe(true);
  });

});
