import CartDTO from '../../../../libs/shared/src/application/cart/cartdto';
import CartInterface from '../../../../libs/shared/src/domain/cart/cart';
import Product from '../../../../libs/shared/src/domain/product/product';
import Id from '../../../../libs/shared/src/domain/valueobjects/id';
import PositiveNumeric from '../../../../libs/shared/src/domain/valueobjects/product/positivenumeric';

export default class Cart implements CartInterface {
    id: string;
    userId: string;
    products?: Product[];
    total?: number;
    created_at?: Date;

    constructor(id: string, userId: string, products: Product[] = [], total: number = 0) {
        this.id = new Id(id).value;
        this.userId = new Id(userId).value;
        this.products = products;
        this.total = new PositiveNumeric(total).value;
        this.created_at = new Date();
    } 
    

    public static getCartFromDTO(order: CartDTO): Cart {
        return new Cart(order.id, order.userId, order.products, order.total);
    }
    
    public static createCart(cartId: string, userId: string): Cart {
        return new Cart(cartId, userId);
    }
}