import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductMongoose } from './product.schema';
import { Model } from 'mongoose';
import { ProductRepository } from '../../../../../../libs/shared/src/domain/product/product.repository';
import Product from '../../../../../../libs/shared/src/domain/product/product';

@Injectable()
export class ProductRepositoryMongoose implements ProductRepository {

    constructor(@InjectModel(ProductMongoose.name)
    private productModel: Model<ProductMongoose>) { }

    async saveProduct(product: Product): Promise<boolean> {
        const createdProduct = new this.productModel(product);
        try {
            if (await createdProduct.save()) return true;
            return false;
        } catch (error) {
            return false;
        }
    }

    async getProduct(id: string): Promise<Product | null> {
        return await this.productModel.findOne({ id });
    }

    async reserveProduct(id: string): Promise<boolean> {
        try {
            const product: ProductMongoose = await this.productModel.findOne({ id });
            if (product.stock > 0) {
                product.stock -= 1;
                product.reserved += 1;
                const updatedProduct = new this.productModel(product);
                updatedProduct.save();
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    async removeReservedProduct(id: string): Promise<boolean> {
        try {
            const product: ProductMongoose = await this.productModel.findOne({ id });
            if (product.reserved > 0) {
                product.reserved -= 1;
                const updatedProduct = new this.productModel(product);
                updatedProduct.save();
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }
}