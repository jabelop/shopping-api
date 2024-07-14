import { Injectable } from '@nestjs/common';
import { OrdersRepository } from '../../../../../libs/shared/src/domain/order/orders.repository';
import Product from '../../../../../libs/shared/src/domain/product/product';
import Order from '../../../../../libs/shared/src/domain/order/order';

@Injectable()
export class OrdersRepositoryTest implements OrdersRepository {
    readonly products: Product[] = [
        { id: "3aae2f88-818c-408b-9990-cd2d2f961623" , name: "product1", price: 10, stock: 10, reserved: 2 }, 
        { id: "4b90ef9d-33d1-487d-bc9e-f861558c84a0", name: "product2", price: 130, stock: 4, reserved: 0 }, 
    ];

    readonly orders: Order[] = [
        { id: "3aae2f88-818c-408b-9990-cd2d2f961623" , userId: "4b90ef9d-33d1-487d-bc9e-f861558c84a0", products: this.products, total: 100 }, 
        { id: "4b90ef9d-33d1-487d-bc9e-f861558c84a0", userId: "3aae2f88-818c-408b-9990-cd2d2f961623", products: [this.products[1]], total: 40 }, 
    ];

    constructor() { }

    async createOrder(order: Order): Promise<boolean> {
        if (order.id && 
            order.userId && 
            order.products.length > 0 &&
            order.total > 0
        )
            return true;
        return false;
    }
    async getOrder(id: string): Promise<Order | null> {
        const order: Order | undefined = this.orders.find((order) => order.id === id);
        return order || null;
    }

    async saveProduct(product: Product): Promise<boolean> {
        if (product.name.length > 4 && 
            product.name.length < 50 && 
            product.price > 0 && 
            product.stock >= 0 &&
            product.reserved >= 0)
            return true;
        return false;
    }
}