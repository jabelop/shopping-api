import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserRepository } from '../../../../../../libs/shared/src/domain/user/user.repository';
import { UserMongoose } from './user.schema';
import { Model } from 'mongoose';
import User from '../../../../../../libs/shared/src/application/user/userdto';

@Injectable()
export class UserRepositoryMongoose implements UserRepository {

    constructor(@InjectModel(UserMongoose.name)
    private userModel: Model<UserMongoose>) {}

    async saveUser(user: User): Promise<boolean> {
        const createdUser = new this.userModel(user);
        if(await createdUser.save()) return true;
        return false;
    }

    async getUser(username: string): Promise<User | null> {
        return await this.userModel.findOne({username});
    }

    async deleteUser(user: User): Promise<boolean> {
        const result: any = await this.userModel.deleteOne({id: user.id});
        return result.deletedCount > 0;
    }
}