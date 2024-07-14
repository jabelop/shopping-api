import { NestFactory } from '@nestjs/core';
import { CartsModule } from './carts.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(CartsModule);
  const configService = app.get(ConfigService);

  const USER = configService.get('RABBITMQ_USER');
  const PASS = configService.get('RABBITMQ_PASS');
  const HOST = configService.get('RABBITMQ_HOST');
  const CARTS_QUEUE = configService.get('RABBITMQ_CARTS_QUEUE');

  app.connectMicroservice<MicroserviceOptions>({
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
  app.startAllMicroservices();

}
bootstrap();
