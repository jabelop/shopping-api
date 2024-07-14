import { BadRequestException, Controller, HttpException, Inject } from '@nestjs/common';
import { ClientProxy, Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { map } from 'rxjs';
import { CartsService } from '../application/carts.service';
import Product from '../../../../libs/shared/src/domain/product/product';

@Controller()
export class CartsController {

  constructor(@Inject(CartsService) private readonly cartsService: CartsService,
    @Inject('CARTS_SERVICE') private readonly rmqService: ClientProxy,
    @Inject('PRODUCTS_SERVICE') private readonly rmqProductsService: ClientProxy
  ) { }

  @MessagePattern({ cmd: 'create-cart' })
  async createCart(@Ctx() context: RmqContext): Promise<boolean | HttpException> {
    try {
      const channel: any = context.getChannelRef();
      const message: Record<string, string> = context.getMessage();
      const { idCart, idUser } = JSON.parse(message.content.toString()).data;
      console.info(":::::::::::::::::::.");
      console.info(idCart, idUser);
      const result: boolean = await this.cartsService.createCart(idCart, idUser);

      channel.ack(message);

      if (result) return true;
      throw new BadRequestException("Data no valid");
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  @MessagePattern({ cmd: 'add-cart-product' })
  async getProduct(@Ctx() context: RmqContext): Promise<boolean | HttpException> {
    try {
      const channel: any = context.getChannelRef();
      const message: Record<string, string> = context.getMessage();
      const { idCart, idProduct } = JSON.parse(message.content.toString()).data;

      this.rmqProductsService.send(
        {
          cmd: 'get-product',
        },
        { idProduct }
      ).pipe(map((result: Product | { message: string, status: number }) => {
        if ((<Product>result).id) return result;

        throw new HttpException(
          (<{ message: string, status: number }>result).message,
          (<{ message: string, status: number }>result).status
        );
      })).subscribe(async (product) => {

        const result: boolean = await this.cartsService.addProductToCart(idCart, <Product>product);
        if (result) {
          channel.ack(message);
          return this.rmqProductsService.send(
            {
              cmd: 'reserve-product',
            },
            { idCart, idProduct }
          ).pipe(map((result: boolean | { message: string, status: number }) => {
            if (typeof result === 'boolean') return result;
    
            throw new HttpException(
              (<{ message: string, status: number }>result).message,
              (<{ message: string, status: number }>result).status
            );
          }));
        }
        return false;
      });

    } catch (error) {
      return error;
    }
  }

  @MessagePattern({ cmd: 'remove-cart-product' })
  async removeProduct(@Ctx() context: RmqContext): Promise<boolean | HttpException> {
    try {
      const channel: any = context.getChannelRef();
      const message: Record<string, string> = context.getMessage();
      const { idCart, idProduct } = JSON.parse(message.content.toString()).data;

      this.rmqProductsService.send(
        {
          cmd: 'remove-cart-product',
        },
        { idProduct }
      ).pipe(map((result: Product | { message: string, status: number }) => {
        if ((<Product>result).id) return result;

        throw new HttpException(
          (<{ message: string, status: number }>result).message,
          (<{ message: string, status: number }>result).status
        );
      })).subscribe(async (product) => {

        const result: boolean = await this.cartsService.addProductToCart(idCart, <Product>product);
        if (result) {
          channel.ack(message);
          return this.rmqProductsService.send(
            {
              cmd: 'remove-reserved-product',
            },
            { idCart, idProduct }
          ).pipe(map((result: boolean | { message: string, status: number }) => {
            if (typeof result === 'boolean') return result;
    
            throw new HttpException(
              (<{ message: string, status: number }>result).message,
              (<{ message: string, status: number }>result).status
            );
          }));
        }
        return false;
      });

    } catch (error) {
      return error;
    }
  }
}
