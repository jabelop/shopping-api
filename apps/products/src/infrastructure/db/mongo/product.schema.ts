import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import Product from '../../../../../../libs/shared/src/domain/product/product';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ collection: "products" })
export class ProductMongoose {
  @Prop({ unique: true })
  id?: string;

  @Prop({ unique: true })
  name: string;

  @Prop({min: 1})
  price: number;

  @Prop({min: 0})
  stock: number;

  @Prop({min: 0})
  reserved: number;
}

export const ProductMongooseSchema = SchemaFactory.createForClass(ProductMongoose);
