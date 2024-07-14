import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CartMongoose } from './cart.schema';
import { Model } from 'mongoose';
import { CartsRepository } from '../../../../../../libs/shared/src/domain/cart/carts.repository';
import Cart from '../../../../../../libs/shared/src/domain/cart/cart';

@Injectable()
export class CartsRepositoryMongoose implements CartsRepository {

    constructor(@InjectModel(CartMongoose.name)
    private cartModel: Model<CartMongoose>) { }

    async createCart(cart: Cart): Promise<boolean> {
        const createdCart = new this.cartModel(cart);

        try {
            if (await createdCart.save()) return true;
            return false;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async saveCart(cart: Cart): Promise<boolean> {
        return await this.createCart(cart);
    }

    createOrderFromCart(cart: Cart): Promise<true> {
        throw new Error('Method not implemented.');
    }

    async getCart(id: string): Promise<Cart | null> {
        return await this.cartModel.findOne({id});
    }
}