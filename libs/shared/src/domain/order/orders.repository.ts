import Order from "./order";

export interface OrdersRepository {

    /**
    * create an order
    * 
    * @param order the order to save
    * 
    * @returns a Promise with true if was created, false if it was not
    */
    createOrder(order: Order): Promise<boolean>;

    /**
     * get a order given its id
     * 
     * @param id the id to look for
     * 
     * @returns a Promise with the order if exists, null if does not
     */
    getOrder(id: string): Promise<Order| null>;

}

export const OrdersRepository = Symbol("OrdersRepository");