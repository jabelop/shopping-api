import Product from '../product/product';

export default interface Cart {
    id: string;
    userId: string;
    products?: Product[];
    total?: number;
    created_at?: Date;
}
