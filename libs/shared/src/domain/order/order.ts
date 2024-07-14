import Product from '../product/product';

export default interface Order {
    id: string;
    userId: string;
    products: Product[];
    total: number;
}
