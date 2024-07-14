import { Test, TestingModule } from '@nestjs/testing';

import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { ProductRepository } from '../../../../../libs/shared/src/domain/product/product.repository';
import { ProductsService } from '../../../src/application/products.service';
import { ProductMongoose } from '../../../src/infrastructure/db/mongo/product.schema';
import { ProductsRepositoryTest } from './productsRepositoryTest';

const productsRepositoryProvider = {provide: ProductRepository, useClass: ProductsRepositoryTest};

describe('ProductService', () => {
  let service: ProductsService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [productsRepositoryProvider, JwtService, ProductMongoose, ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save a product', async () => {
    expect(await service.saveProduct({id: randomUUID(), name: "product3", price: 12, stock: 5, reserved: 2})).toBe(true);
  });

  it('should remove a reserved product', async () => {
    expect(await service.removeReservedProduct("3aae2f88-818c-408b-9990-cd2d2f961623")).toBe(true);
  });

  it('should reserve product', async () => {
    expect(await service.reserveProduct("4b90ef9d-33d1-487d-bc9e-f861558c84a0")).toBe(true);
  });
});
