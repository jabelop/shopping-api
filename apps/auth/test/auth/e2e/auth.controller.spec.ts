import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../../api/src/app.module';
import { ClientProxy, ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from '../../../src/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from '../../../../api/src/infrastructure/app.controller';
import { randomUUID } from 'crypto';


describe('AuthController', () => {
  let app: INestApplication;

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
            const ORDERS_QUEUE = configService.get('RABBITMQ_ORDERS_QUEUE');
          
            return ClientProxyFactory.create({
              transport: Transport.RMQ,
              options: {
                urls: [`amqp://${USER}:${PASS}@${HOST}`],
                noAck: false,
                queue: ORDERS_QUEUE,
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


  it('should response 201 on POST /auth/login good data', async () => {
    try {
      await request(app.getHttpServer())
      .post('/auth/signup')
      .send({id: "3aae2f88-818c-408b-9990-cd2d2f961623",username: "test1", password: "test1Password"});
    } catch (error) {}
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({username: "test1", password: "test1Password"})
      .then((response) => {
        expect(response.statusCode).toBe(201);
      });
  });

  it('should response 404 on POST /auth/login not existing data', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({username: "test11", password: "test11Password"})
      .then((response) => {
        expect(response.statusCode).toBe(404);
      });
  });
});
