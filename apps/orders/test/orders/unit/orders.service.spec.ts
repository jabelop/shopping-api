import { Test, TestingModule } from '@nestjs/testing';

import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { OrdersRepository } from '../../../../../libs/shared/src/domain/order/orders.repository';
import { OrdersService } from '../../../src/application/orders.service';
import { OrderMongoose } from '../../../src/infrastructure/db/mongo/order.schema';
import { OrdersRepositoryTest } from './ordersRepositoryTest';
import Product from '../../../../../libs/shared/src/domain/product/product';

const productsRepositoryProvider = {provide: OrdersRepository, useClass: OrdersRepositoryTest};

describe('OrdersService', () => {
  let service: OrdersService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [productsRepositoryProvider, JwtService, OrderMongoose, OrdersService],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an order', async () => {
    const products: Product[] = [{ id: "4b90ef9d-33d1-487d-bc9e-f861558c84a0", name: "product2", price: 130, stock: 4, reserved: 0 }];
    expect(await service.createOrder({id: randomUUID(), userId: randomUUID(), products, total: 40})).toBe(true);
  });

  it('should get an order', async () => {
    expect(await service.getOrder("3aae2f88-818c-408b-9990-cd2d2f961623")).not.toBe(null);
  });

});
