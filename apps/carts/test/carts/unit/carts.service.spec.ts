import { Test, TestingModule } from '@nestjs/testing';

import { JwtService } from '@nestjs/jwt';
import { randomUUID, UUID } from 'crypto';
import { CartsRepository } from '../../../../../libs/shared/src/domain/cart/carts.repository';
import { CartsService } from '../../../src/application/carts.service';
import { CartMongoose } from '../../../src/infrastructure/db/mongo/cart.schema';
import { CartsRepositoryTest } from './cartsRepositoryTest';
import Product from '../../../../../libs/shared/src/domain/product/product';

const cartsRepositoryProvider = {provide: CartsRepository, useClass: CartsRepositoryTest};

describe('CartsService', () => {
  let service: CartsService;
  let idCart: UUID = randomUUID();
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [cartsRepositoryProvider, JwtService, CartMongoose, CartsService],
    }).compile();

    service = module.get<CartsService>(CartsService);
  
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a cart', async () => {
    expect(await service.createCart(idCart, randomUUID())).toBe(true);
  });

  it('should add a product to cart', async () => {
    const product: Product = { id: "4b90ef9d-33d1-487d-bc9e-f861558c84a0", name: "product2", price: 130, stock: 4, reserved: 0 };
    expect(await service.addProductToCart('3aae2f88-818c-408b-9990-cd2d2f961623', product)).not.toBe(null);
  });

  it('should remove a product to cart', async () => {
    const product: Product = { id: "3aae2f88-818c-408b-9990-cd2d2f961623" , name: "product1", price: 10, stock: 10, reserved: 2 };
    expect(await service.addProductToCart('3aae2f88-818c-408b-9990-cd2d2f961623', product)).not.toBe(null);
  });

});
