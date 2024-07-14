import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../../api/src/app.module';
import { ClientProxy, ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from '../../../src/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from '../../../../api/src/infrastructure/app.controller';


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
        }]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // beforeAll(async () => {
  //   const moduleFixture: TestingModule = await Test.createTestingModule({
  //     imports: [
  //       AppModule,
  //       ClientsModule.register([
  //         { name: 'AuthService', transport: Transport.RMQ },
  //       ]),
  //     ],
  //   }).compile();

  //   app = moduleFixture.createNestApplication();

  //   app.connectMicroservice({
  //     transport: Transport.RMQ,
  //   });

  //   await app.startAllMicroservices();
  //   await app.init();

  //   client = app.get('AuthService');
  //   await client.connect();
  // });

  // beforeAll(async () => {
  //   const moduleFixture: TestingModule = await Test.createTestingModule({
  //     imports: [
  //       AppModule,
  //       ClientsModule.register([
  //         { name: 'AUTH_SERVICE', transport: Transport.RMQ },
  //       ]),
  //     ],
  //   }).compile();

  //   app = moduleFixture.createNestApplication();

  //   app.connectMicroservice({
  //     transport: Transport.RMQ,
  //   });

  //   await app.startAllMicroservices();
  //   await app.init();

  //   client = app.get('AUTH_SERVICE');
  //   await client.connect();
  // });

  afterAll(async () => {
    await app.close();
    // client.close();
  });


  it('should response 200 on POST /auth/login good data', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({username: "test1", password: "test1Password"})
      .then((response) => {
        expect(response.statusCode).toBe(200);
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
