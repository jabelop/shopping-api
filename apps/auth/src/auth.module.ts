import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/auth.controller';
import { AuthService } from './application/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { UserMongoose, UserMongooseSchema } from './infrastructure/db/mongo/user.schema';
import { UserRepository } from '../../../libs/shared/src/domain/user/user.repository';
import { UserRepositoryMongoose } from './infrastructure/db/mongo/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { env } from 'process';

const userRepositoryProvider = {provide: UserRepository, useClass: UserRepositoryMongoose};
let url = `mongodb://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}`
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env'
    }),
    MongooseModule.forRoot(url),
    MongooseModule.forFeature([{ name: UserMongoose.name, schema: UserMongooseSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    userRepositoryProvider, 
    JwtService,
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
    }
  ],
})
export class AuthModule {}
