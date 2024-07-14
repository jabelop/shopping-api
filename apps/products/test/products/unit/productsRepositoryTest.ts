import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../../../../libs/shared/src/domain/product/product.repository';
import { randomUUID } from 'crypto';
import Product from '../../../../../libs/shared/src/domain/product/product';

@Injectable()
export class ProductsRepositoryTest implements ProductRepository {
    readonly products: Product[] = [
        { id: "3aae2f88-818c-408b-9990-cd2d2f961623" , name: "product1", price: 10, stock: 10, reserved: 2 }, 
        { id: "4b90ef9d-33d1-487d-bc9e-f861558c84a0", name: "product2", price: 130, stock: 4, reserved: 0 }, 
    ];

    constructor() { }

    async saveProduct(product: Product): Promise<boolean> {
        if (product.name.length > 4 && 
            product.name.length < 50 && 
            product.price > 0 && 
            product.stock >= 0 &&
            product.reserved >= 0)
            return true;
        return false;
    }

    async getProduct(id: string): Promise<Product | null> {
        const product: Product | undefined = this.products.find((product) => product.id === id);
        return product || null;
    }

    async reserveProduct(id: string): Promise<boolean> {
        const product: Product | null = await this.getProduct(id);
        if (product && product.stock > 0) return true;
        return false;
    }

    async removeReservedProduct(id: string): Promise<boolean> {
        const product: Product | null = await this.getProduct(id);
        if (product && product.reserved > 0) return true;
        return false;
    }
}