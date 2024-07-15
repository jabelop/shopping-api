import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { TotalCartsController } from '../src/infrastructure/total-carts.controller';
import { TotalCartsService } from './application/total-carts.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env'
    }),
  ],
  controllers: [TotalCartsController],
  providers: [
    TotalCartsService,
    JwtService,
    {
      provide: 'CARTS_TOTAL_SERVICE',
      useFactory: (configService: ConfigService) => {

        const USER = configService.get('RABBITMQ_USER');
        const PASS = configService.get('RABBITMQ_PASS');
        const HOST = configService.get('RABBITMQ_HOST');
        const CARTS_TOTAL_QUEUE = configService.get('RABBITMQ_CARTS_TOTAL_QUEUE');
      
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${USER}:${PASS}@${HOST}`],
            noAck: false,
            queue: CARTS_TOTAL_QUEUE,
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

export class TotalCartsModule {}
