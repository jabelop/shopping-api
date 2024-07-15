import { NestFactory } from '@nestjs/core';
import { TotalCartsModule } from './total-carts.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(TotalCartsModule);
  const configService = app.get(ConfigService);

  const USER = configService.get('RABBITMQ_USER');
  const PASS = configService.get('RABBITMQ_PASS');
  const HOST = configService.get('RABBITMQ_HOST');
  const CARTS_TOTAL_QUEUE = configService.get('RABBITMQ_CARTS_TOTAL_QUEUE');

  app.connectMicroservice<MicroserviceOptions>({
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
  app.startAllMicroservices();

}
bootstrap();
