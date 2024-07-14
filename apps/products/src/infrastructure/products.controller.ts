import { BadRequestException, Controller, HttpException, Inject, NotFoundException } from '@nestjs/common';
import { ProductsService } from '../application/products.service';
import { ClientProxy, Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import Product from '../domain/product';

@Controller()
export class ProductsController {
  constructor(@Inject(ProductsService) private readonly productsService: ProductsService, @Inject('PRODUCTS_SERVICE') private readonly rmqService: ClientProxy) { }

  @MessagePattern({ cmd: 'save-product' })
  async saveProduct(@Ctx() context: RmqContext): Promise<boolean | HttpException> {
    try {
      const channel: any = context.getChannelRef();
      const message: Record<string, string> = context.getMessage();
      const product: Product = JSON.parse(message.content.toString()).data;
      const result: boolean = await this.productsService.saveProduct(product);
      channel.ack(message);

      if (result) return true;
    } catch (error) {
      return error;
    }
  }

  @MessagePattern({ cmd: 'get-product' })
  async getProduct(@Ctx() context: RmqContext): Promise<Product | HttpException> {
    try {
      const channel: any = context.getChannelRef();
      const message: Record<string, string> = context.getMessage();
      const { id } = JSON.parse(message.content.toString()).data;
      channel.ack(message);
      return this.productsService.getProduct(id) || new NotFoundException('Product not found');
    } catch (error) {
      return error;
    }
  }

  @MessagePattern({ cmd: 'reserve-product' })
  async reserveProduct(@Ctx() context: RmqContext): Promise<boolean | HttpException> {
    try {
      const channel: any = context.getChannelRef();
      const message: Record<string, string> = context.getMessage();
      const { id } = JSON.parse(message.content.toString()).data;
      channel.ack(message);
      return this.productsService.reserveProduct(id) || new BadRequestException('Product can not be reserved');
    } catch (error) {
      return error;
    }

  }

  @MessagePattern({ cmd: 'remove-reserved-product' })
  async removeReservedProduct(@Ctx() context: RmqContext): Promise<boolean | HttpException> {
    try {
      const channel: any = context.getChannelRef();
      const message: Record<string, string> = context.getMessage();
      const { id } = JSON.parse(message.content.toString()).data;
      channel.ack(message);
      return this.productsService.removeReservedProduct(id) || new BadRequestException('Product can not be added to order');
    } catch (error) {
      return error;
    }
  }
}
