import OrderDTO from '../../../../libs/shared/src/application/order/orderdto'
import OrderInterface from '../../../../libs/shared/src/domain/order/order' ;
import Product from '../../../../libs/shared/src/domain/product/product';
import Id from '../../../../libs/shared/src/domain/valueobjects/id';
import Price from '../../../../libs/shared/src/domain/valueobjects/product/price';

export default class Order implements OrderInterface {
    id: string;
    userId: string;
    products: Product[];
    total: number;

    constructor(id: string, userId: string, products: Product[], total: number) {
        this.id = new Id(id).value;
        this.userId = new Id(userId).value;
        this.products = products;
        this.total = new Price(total).value;
    } 
    

    public static getOrderFromDTO(order: OrderDTO): Order {
        return new Order(order.id, order.userId, order.products, order.total);
    } 
}