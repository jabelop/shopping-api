import { Controller, HttpException, Inject } from '@nestjs/common';
import { ClientProxy, Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import Product from '../../../../libs/shared/src/application/product/prouctdto';
import { TotalCartsService } from '../application/total-carts.service';

@Controller()
export class TotalCartsController {
  constructor(@Inject(TotalCartsService) private readonly totalCartsService: TotalCartsService,
    @Inject('CARTS_TOTAL_SERVICE') private readonly rmqService: ClientProxy) { }

  @MessagePattern({ cmd: 'get-total' })
  async saveProduct(@Ctx() context: RmqContext): Promise<number | HttpException> {
    try {
      const channel: any = context.getChannelRef();
      const message: Record<string, string> = context.getMessage();
      const products: Product[] = JSON.parse(message.content.toString()).data;
      channel.ack(message);
      return this.totalCartsService.getTotal(products);
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}

