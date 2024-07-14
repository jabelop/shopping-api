import { HttpException, Injectable } from '@nestjs/common';
import { CartsRepository } from '../../../../../libs/shared/src/domain/cart/carts.repository';
import Product from '../../../../../libs/shared/src/domain/product/product';
import Order from '../../../../../libs/shared/src/domain/order/order';
import Cart from '../../../../../libs/shared/src/domain/cart/cart';

@Injectable()
export class CartsRepositoryTest implements CartsRepository {
    readonly products: Product[] = [
        { id: "3aae2f88-818c-408b-9990-cd2d2f961623" , name: "product1", price: 10, stock: 10, reserved: 2 }, 
        { id: "4b90ef9d-33d1-487d-bc9e-f861558c84a0", name: "product2", price: 130, stock: 4, reserved: 0 }, 
    ];

    readonly carts: Cart[] = [
        { id: "3aae2f88-818c-408b-9990-cd2d2f961623" , userId: "4b90ef9d-33d1-487d-bc9e-f861558c84a0", products: this.products, total: 100 },
        { id: "3aae2f88-818c-408b-9990-cd2d2f964423" , userId: "4b90ef9d-33d1-487d-ba9e-f8613d8c84a0", products: this.products, total: 120 }
    ];

    constructor() { }
    async createCart(cart: Cart): Promise<boolean> {
        if (cart.id && 
            cart.userId && 
            cart.products !== undefined &&
            cart.total !== undefined
        )
            return true;
        return false;
    }
    async saveCart(cart: Cart): Promise<boolean> {
        if (cart.id && 
            cart.userId && 
            cart.products.length > 0 &&
            cart.total > 0
        )
            return true;
        return false;
    }
    
    async createOrderFromCart(cart: Cart): Promise<boolean> {
        if (cart.id && 
            cart.userId && 
            cart.products.length > 0 &&
            cart.total > 0
        )
            return true;
        return false;
    }

    async getCart(id: string): Promise<Cart | null> {
        console.info("::::::::::::::::::::::::");
        console.info("idCart:", id);
        const cart: Cart | undefined = this.carts.find((order) => order.id === id);
        return cart || null;
    }
}