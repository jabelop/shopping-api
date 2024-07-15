import { BadRequestException, Controller, HttpException, Inject, NotFoundException } from '@nestjs/common';
import { ClientProxy, Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { map } from 'rxjs';
import { CartsService } from '../application/carts.service';
import Product from '../../../../libs/shared/src/domain/product/product';
import Cart from '../../../../libs/shared/src/application/cart/cartdto';

@Controller()
export class CartsController {

  constructor(@Inject(CartsService) private readonly cartsService: CartsService,
    @Inject('CARTS_SERVICE') private readonly rmqService: ClientProxy,
    @Inject('PRODUCTS_SERVICE') private readonly rmqProductsService: ClientProxy,
    @Inject('CARTS_TOTAL_SERVICE') private readonly rmqCartsTotalService: ClientProxy
  ) { }

  @MessagePattern({ cmd: 'create-cart' })
  async createCart(@Ctx() context: RmqContext): Promise<boolean | HttpException> {
    try {
      const channel: any = context.getChannelRef();
      const message: Record<string, string> = context.getMessage();
      const { idCart, idUser } = JSON.parse(message.content.toString()).data;
      const result: boolean = await this.cartsService.createCart(idCart, idUser);

      channel.ack(message);

      if (result) return true;
      throw new BadRequestException("Data no valid");
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  @MessagePattern({ cmd: 'get-cart' })
  async getCart(@Ctx() context: RmqContext): Promise<Cart | HttpException> {
    try {
      const channel: any = context.getChannelRef();
      const message: Record<string, string> = context.getMessage();
      console.info("Cart:",JSON.parse(message.content.toString()).data);
      const { id } = JSON.parse(message.content.toString()).data;
      const cart: Cart = await this.cartsService.getCart(id);

      channel.ack(message);

      return cart || new NotFoundException('Cart not found');
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

        const cart: Cart = await this.cartsService.addProductToCart(idCart, <Product>product);

        if (cart) {
          
          this.rmqCartsTotalService.send({cmd: 'get-total'}, cart)
          .pipe(map((result: number | { message: string, status: number }) => {
            if (typeof result === 'number') return result;
    
            throw new HttpException(
              (<{ message: string, status: number }>result).message,
              (<{ message: string, status: number }>result).status
            );
          })).subscribe(async (total: number) => {
            cart.total = total;
            await this.cartsService.saveCart(cart);
          });

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

        const result: Cart = await this.cartsService.addProductToCart(idCart, <Product>product);
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
