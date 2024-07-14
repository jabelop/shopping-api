import { Module } from '@nestjs/common';
import { OrdersController } from './infrastructure/orders.controller';
import { OrdersService } from './application/orders.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { env } from 'process';
import { OrdersRepository } from '../../../libs/shared/src/domain/order/orders.repository';
import { OrdersRepositoryMongoose } from './infrastructure/db/mongo/orders.repository';
import { OrderMongoose, OrderMongooseSchema } from './infrastructure/db/mongo/order.schema';

const ordersRepositoryProvider = {provide: OrdersRepository, useClass: OrdersRepositoryMongoose};
let url = `mongodb://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env'
    }),
    MongooseModule.forRoot(url),
    MongooseModule.forFeature([{ name: OrderMongoose.name, schema: OrderMongooseSchema }]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService,
    ordersRepositoryProvider, 
    JwtService,
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
    }
  ],
})
export class OrdersModule {}
