import { NestFactory } from '@nestjs/core';
import { ProductsModule } from './products.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(ProductsModule);
  const configService = app.get(ConfigService);

  const USER = configService.get('RABBITMQ_USER');
  const PASS = configService.get('RABBITMQ_PASS');
  const HOST = configService.get('RABBITMQ_HOST');
  const PRODUCTS_QUEUE = configService.get('RABBITMQ_PRODUCTS_QUEUE');

  app.connectMicroservice<MicroserviceOptions>({
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
  app.startAllMicroservices();

}
bootstrap();
