

import { BadRequestException, Controller, HttpException, Inject, NotFoundException } from '@nestjs/common';
import { ClientProxy, Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import Order from '../domain/order';
import { OrdersService } from '../application/orders.service';

@Controller()
export class OrdersController {
  constructor(@Inject(OrdersService) private readonly ordersService: OrdersService, @Inject('ORDERS_SERVICE') private readonly rmqService: ClientProxy) { }

  @MessagePattern({ cmd: 'create-order' })
  async saveProduct(@Ctx() context: RmqContext): Promise<boolean | HttpException> {
    try {
      const channel: any = context.getChannelRef();
      const message: Record<string, string> = context.getMessage();
      const order: Order = JSON.parse(message.content.toString()).data;
      
      const result: boolean = await this.ordersService.createOrder(order);
      
      channel.ack(message);

      if (result) return true;
      throw new BadRequestException("Order no valid");
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  @MessagePattern({ cmd: 'get-order' })
  async getProduct(@Ctx() context: RmqContext): Promise<Order | HttpException> {
    try {
      const channel: any = context.getChannelRef();
      const message: Record<string, string> = context.getMessage();
      const { id } = JSON.parse(message.content.toString()).data;
      channel.ack(message);

      const order = await 
      this.ordersService.getOrder(id);

      return  order || new NotFoundException('Order not found');
      
    } catch (error) {
      return error;
    }
  }
}
