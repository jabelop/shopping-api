import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import Order from '../../../../../../libs/shared/src/domain/order/order';
import Product from '../../../../../products/src/domain/product';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ collection: "orders" })
export class OrderMongoose {
  @Prop({ unique: true })
  id?: string;

  @Prop()
  userId: string;

  @Prop()
  products: Product[];

  @Prop({min: 1})
  total: number;
}

export const OrderMongooseSchema = SchemaFactory.createForClass(OrderMongoose);
