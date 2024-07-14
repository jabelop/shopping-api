import { Test, TestingModule } from '@nestjs/testing';

import { JwtService } from '@nestjs/jwt';
import { CartsRepository } from '../../../../../libs/shared/src/domain/cart/carts.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from 'process';
import { randomUUID, UUID } from 'crypto';
import { CartsService } from '../../../src/application/carts.service';
import { CartsModule } from '../../../src/carts.module';
import Product from '../../../../../libs/shared/src/domain/product/product';
import Cart from '../../../../../libs/shared/src/domain/cart/cart';

describe('CartsService', () => {
  let service: CartsService;
  let cartsRepository: CartsRepository;
  const id: UUID = randomUUID();

  const products: Product[] = [
    { id: "3aae2f88-818c-408b-9990-cd2d2f961623" , name: "product1", price: 10, stock: 10, reserved: 2 }, 
    { id: "4b90ef9d-33d1-487d-bc9e-f861558c84a0", name: "product2", price: 130, stock: 4, reserved: 0 }
  ];

  const cart: Cart = 
    { id: id, userId: "4b90ef9d-33d1-487d-bc9e-f861558c84a0", products, total: 50 };
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ MongooseModule.forRoot(`mongodb://${env.DB_HOST_TEST}/${env.DB_NAME_TEST}`), CartsModule],
      providers: [JwtService],
    }).compile();

    service = module.get<CartsService>(CartsService);
    cartsRepository = module.get<CartsRepository>(CartsRepository);
    cartsRepository.createCart(cart);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('should get an order', async () => {
  //   expect(await ordersRepository.getOrder(id)).not.toBe(null);
  // });
});
