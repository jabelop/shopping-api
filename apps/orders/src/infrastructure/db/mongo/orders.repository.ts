import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OrderMongoose } from './order.schema';
import { Model } from 'mongoose';
import { OrdersRepository } from '../../../../../../libs/shared/src/domain/order/orders.repository';
import Order from '../../../../../../libs/shared/src/domain/order/order';

@Injectable()
export class OrdersRepositoryMongoose implements OrdersRepository {

    constructor(@InjectModel(OrderMongoose.name)
    private orderModel: Model<OrderMongoose>) { }

    async createOrder(order: Order): Promise<boolean> {
        const createdOrder = new this.orderModel(order);

        try {
            if (await createdOrder.save()) return true;
            return false;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    async getOrder(id: string): Promise<Order | null> {
        return await this.orderModel.findOne({ id });
    }
}