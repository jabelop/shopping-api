import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from '../../../../api/src/infrastructure/app.controller';
import { randomUUID, UUID } from 'crypto';
import Product from '../../../../../libs/shared/src/application/product/prouctdto';
import Cart from '../../../../../libs/shared/src/application/cart/cartdto';


describe('CartsController', () => {
  let app: INestApplication;
  const id: UUID = randomUUID();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: './.env'
        })
      ],
      controllers: [
        AppController
      ],
      providers: [
        {
          provide: 'AUTH_SERVICE',
          useFactory: (configService: ConfigService) => {
    
            
            const USER = configService.get('RABBITMQ_USER');
            const PASS = configService.get('RABBITMQ_PASS');
            const HOST = configService.get('RABBITMQ_HOST_TEST');
            const AUTH_QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');
          
            return ClientProxyFactory.create({
              transport: Transport.RMQ,
              options: {
                urls: [`amqp://${USER}:${PASS}@${HOST}`],
                noAck: false,
                queue: AUTH_QUEUE,
                queueOptions: {
                  durable: true
                }
              }
            });
          },
          inject: [ConfigService],
        },
        {
          provide: 'PRODUCTS_SERVICE',
          useFactory: (configService: ConfigService) => {
    
            
            const USER = configService.get('RABBITMQ_USER');
            const PASS = configService.get('RABBITMQ_PASS');
            const HOST = configService.get('RABBITMQ_HOST');
            const PRODUCT_QUEUE = configService.get('RABBITMQ_PRODUCTS_QUEUE');
          
            return ClientProxyFactory.create({
              transport: Transport.RMQ,
              options: {
                urls: [`amqp://${USER}:${PASS}@${HOST}`],
                noAck: false,
                queue: PRODUCT_QUEUE,
                queueOptions: {
                  durable: true
                }
              }
            });
          },
          inject: [ConfigService],
        },
        {
          provide: 'ORDERS_SERVICE',
          useFactory: (configService: ConfigService) => {
    
            
            const USER = configService.get('RABBITMQ_USER');
            const PASS = configService.get('RABBITMQ_PASS');
            const HOST = configService.get('RABBITMQ_HOST');
            const ORDERS__QUEUE = configService.get('RABBITMQ_ORDERS_QUEUE');
          
            return ClientProxyFactory.create({
              transport: Transport.RMQ,
              options: {
                urls: [`amqp://${USER}:${PASS}@${HOST}`],
                noAck: false,
                queue: ORDERS__QUEUE,
                queueOptions: {
                  durable: true
                }
              }
            });
          },
          inject: [ConfigService],
        },
        {
          provide: 'CARTS_SERVICE',
          useFactory: (configService: ConfigService) => {
    
            
            const USER = configService.get('RABBITMQ_USER');
            const PASS = configService.get('RABBITMQ_PASS');
            const HOST = configService.get('RABBITMQ_HOST');
            const CARTS_QUEUE = configService.get('RABBITMQ_CARTS_QUEUE');
          
            return ClientProxyFactory.create({
              transport: Transport.RMQ,
              options: {
                urls: [`amqp://${USER}:${PASS}@${HOST}`],
                noAck: false,
                queue: CARTS_QUEUE,
                queueOptions: {
                  durable: true
                }
              }
            });
          },
          inject: [ConfigService],
        }
      ]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should response 201 on POST carts/create good data', async () => {
    const data =
      { id: randomUUID(), userId: randomUUID()}
    return request(app.getHttpServer())
      .post('/carts/create')
      .send(data)
      .then((response) => {
        expect(response.statusCode).toBe(201);
      });
  });

  it('should response 200 on Get /carts/:id existing data', async () => {
      const newId = "4b90ef9d-33d1-487d-bc9e-f864d52c84a0";
      const products: Product[] = [{ "id": randomUUID(), "name": randomUUID(), "price": 130, "stock": 4, "reserved": 0 }];
      const cart: Cart =
        { id: newId, userId: "4b90ef9d-33d1-487d-bc9e-f861558c84a0", products: products, total: 100 };
      try {
          await request(app.getHttpServer())
        .post('/carts/create')
        .send(cart)
        .then((response) => {
          expect(response.statusCode).toBe(201);
        });
      } catch (error) {}
      return request(app.getHttpServer())
        .get(`/carts/${newId}`)
        .then((response) => {
          expect(response.statusCode).toBe(200);
        });
    });
});
