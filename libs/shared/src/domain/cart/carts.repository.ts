import { HttpException } from "@nestjs/common";
import Cart from "./cart";

export interface CartsRepository {

    /**
    * create a cart
    * 
    * @param cart the cart to create
    * 
    * @returns a Promise with true if was created, false if it was not
    */
    createCart(cart: Cart): Promise<boolean>;

    /**
     * save a cart
     * 
     * @param car the cart to save
     * 
     * @returns a Promise with true if the product was added, false if was not
     */
    saveCart(cart: Cart): Promise<boolean>;

    /**
     * create an order from a cart
     * 
     * @param cart the cart to create the order from
     * 
     * @returns a Promise with the true if the order was created, false if was not
     */
    createOrderFromCart(cart: Cart): Promise<boolean>;

    /**
     * get a cart given its id
     * 
     * @param id the id to look for
     * 
     * @returns a Promise with the true if the cart was found, false if was not
     */
    getCart(id: string): Promise<Cart | null>;

}

export const CartsRepository = Symbol("CartsRepository");