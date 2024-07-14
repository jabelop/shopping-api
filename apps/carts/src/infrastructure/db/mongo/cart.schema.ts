import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import Cart from '../../../../../../libs/shared/src/domain/cart/cart';
import Product from '../../../../../products/src/domain/product';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ collection: "carts" })
export class CartMongoose {
  @Prop({ unique: true })
  id?: string;

  @Prop()
  userId: string;

  @Prop()
  products: Product[];

  @Prop({min: 1})
  total: number;
}

export const CartMongooseSchema = SchemaFactory.createForClass(CartMongoose);
