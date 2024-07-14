import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { env } from 'process';
import { CartsRepository } from '../../../libs/shared/src/domain/cart/carts.repository';
import { CartsRepositoryMongoose } from './infrastructure/db/mongo/carts.repository';
import { CartMongoose, CartMongooseSchema } from './infrastructure/db/mongo/cart.schema';
import { CartsController } from './infrastructure/cart.controller';
import { CartsService } from './application/carts.service';

const cartsRepositoryProvider = {provide: CartsRepository, useClass: CartsRepositoryMongoose};
let url = `mongodb://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env'
    }),
    MongooseModule.forRoot(url),
    MongooseModule.forFeature([{ name: CartMongoose.name, schema: CartMongooseSchema }]),
  ],
  controllers: [CartsController],
  providers: [
    CartsService,
    cartsRepositoryProvider, 
    JwtService,
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
    },
    {
      provide: 'PRODUCTS_SERVICE',
      useFactory: (configService: ConfigService) => {

        const USER = configService.get('RABBITMQ_USER');
        const PASS = configService.get('RABBITMQ_PASS');
        const HOST = configService.get('RABBITMQ_HOST');
        const PRODUCTS_QUEUE = configService.get('RABBITMQ_PRODUCTS_QUEUE');
      
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${USER}:${PASS}@${HOST}`],
            noAck: false,
            queue: PRODUCTS_QUEUE,
            queueOptions: {
              durable: true
            }
          }
        });
      },
      inject: [ConfigService],
    }
  ],
})
export class CartsModule {}
