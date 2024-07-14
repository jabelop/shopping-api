import { Test, TestingModule } from '@nestjs/testing';

import { JwtService } from '@nestjs/jwt';
import { OrdersRepository } from '../../../../../libs/shared/src/domain/order/orders.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from 'process';
import { randomUUID, UUID } from 'crypto';
import { OrdersService } from '../../../src/application/orders.service';
import { OrdersModule } from '../../../src/orders.module';
import Product from '../../../../../libs/shared/src/domain/product/product';
import Order from '../../../../../libs/shared/src/domain/order/order';

describe('OrdersService', () => {
  let service: OrdersService;
  let ordersRepository: OrdersRepository;
  const id: UUID = randomUUID();

  const products: Product[] = [
    { id: "3aae2f88-818c-408b-9990-cd2d2f961623" , name: "product1", price: 10, stock: 10, reserved: 2 }, 
    { id: "4b90ef9d-33d1-487d-bc9e-f861558c84a0", name: "product2", price: 130, stock: 4, reserved: 0 }
  ];

  const order: Order = 
    { id, userId: "4b90ef9d-33d1-487d-bc9e-f861558c84a0", products, total: 50 };
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ MongooseModule.forRoot(`mongodb://${env.DB_HOST_TEST}/${env.DB_NAME_TEST}`), OrdersModule],
      providers: [JwtService],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get<OrdersRepository>(OrdersRepository);
    ordersRepository.createOrder(order);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get an order', async () => {
    expect(await ordersRepository.getOrder(id)).not.toBe(null);
  });
});
