
import { Inject, Injectable } from '@nestjs/common';
import Product from '../domain/order';
import { OrdersRepository } from '../../../../libs/shared/src/domain/order/orders.repository';
import Order from '../domain/order';
import OrderDTO from '../../../../libs/shared/src/application/order/orderdto';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(OrdersRepository) private readonly ordersRepository: OrdersRepository
  ) { }


  /**
   * create an order
   * 
   * @param order the order to save
   * 
   * @returns a Promise with true if the order was saved, false it there was an error
   */
  async createOrder(order: OrderDTO): Promise<boolean> {
    const orderModel: Order = Order.getOrderFromDTO(order);
    return await this.ordersRepository.createOrder(orderModel);
  }

  /**
   * get an order
   * 
   * @param id the id to look for
   * 
   * @returns a Promise with the order if was found, null if not
   */
  async getOrder(id: string): Promise <Order> {
    return await this.ordersRepository.getOrder(id);
  }

}
