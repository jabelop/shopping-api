import { Module } from '@nestjs/common';
import { ProductsController } from './infrastructure/products.controller';
import { ProductsService } from './application/products.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { env } from 'process';
import { ProductRepository } from '../../../libs/shared/src/domain/product/product.repository';
import { ProductRepositoryMongoose } from './infrastructure/db/mongo/product.repository';
import { ProductMongoose, ProductMongooseSchema } from './infrastructure/db/mongo/product.schema';

const productRepositoryProvider = {provide: ProductRepository, useClass: ProductRepositoryMongoose};
let url = `mongodb://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env'
    }),
    MongooseModule.forRoot(url),
    MongooseModule.forFeature([{ name: ProductMongoose.name, schema: ProductMongooseSchema }]),
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    productRepositoryProvider, 
    JwtService,
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
export class ProductsModule {}
