import Product from "./order";

export interface OrdersRepository {

    /**
    * create an order
    * 
    * @param order the order to save
    * 
    * @returns a Promise with true if was created, false if it was not
    */
    createOrder(order: Product): Promise<boolean>;

    /**
     * get a order given its id
     * 
     * @param id the id to look for
     * 
     * @returns a Promise with the order if exists, null if does not
     */
    getOrder(id: string): Promise<Product | null>;

}

export const OrdersRepository = Symbol("OrdersRepository");