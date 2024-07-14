import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import User from '../../../../../../libs/shared/src/domain/user/user';

export type UserDocument = HydratedDocument<User>;

@Schema({collection: "users"})
export class UserMongoose {
  @Prop({unique: true})
  id?: string;

  @Prop({unique: true})
  username: string;

  @Prop()
  password: string;
}

export const UserMongooseSchema = SchemaFactory.createForClass(UserMongoose);
