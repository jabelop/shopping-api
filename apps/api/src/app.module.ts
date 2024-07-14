import { Module } from '@nestjs/common';
import { AppController } from './infrastructure/app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env'
    })
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'AUTH_SERVICE',
      useFactory: (configService: ConfigService) => {

        
        const USER = configService.get('RABBITMQ_USER');
        const PASS = configService.get('RABBITMQ_PASS');
        const HOST = configService.get('RABBITMQ_HOST');
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
  ],
})
export class AppModule { }
