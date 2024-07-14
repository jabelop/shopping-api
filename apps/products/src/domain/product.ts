import ProductDTO from '../../../../libs/shared/src/application/product/prouctdto'
import ProductInterface from '../../../../libs/shared/src/domain/product/product' ;
import Id from '../../../../libs/shared/src/domain/valueobjects/id';
import Name from '../../../../libs/shared/src/domain/valueobjects/product/name';
import PositiveNumeric from '../../../../libs/shared/src/domain/valueobjects/product/positivenumeric';
import Price from '../../../../libs/shared/src/domain/valueobjects/product/price';

export default class Product implements ProductInterface {
    id: string;
    name: string;
    price: number;
    stock: number;
    reserved: number;

    constructor(id: string, name: string, price: number, stock: number, reserved: number) {
        this.id = new Id(id).value;
        this.name = new Name(name).value;
        this.price = new Price(price).value;
        this.stock = new PositiveNumeric(stock).value;
        this.reserved = new PositiveNumeric(reserved).value;
    } 

    public static getProductFromDTO(product: ProductDTO): Product {
        return new Product(product.id, product.name, product.price, product.stock, product.reserved);
    } 
}