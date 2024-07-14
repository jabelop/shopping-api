import { Injectable } from '@nestjs/common';
import User from '../../../../../libs/shared/src/domain/user/user';
import { UserRepository } from '../../../../../libs/shared/src/domain/user/user.repository';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepositoryTest implements UserRepository {
    users: User[] = [
        { id: randomUUID(), username: "test1", password:  "test1Password" }, 
        { id: randomUUID(), username: "test2", password: "test2Password" }
    ]
    constructor() { }


    async saveUser(user: User): Promise<boolean> {
        if (user.username.length > 1 && 
            user.username.length < 50 && 
            user.password.length > 6 && 
            user.password.length < 64)
            return true;
        return false;
    }

    async getUser(username: string): Promise<User | null> {
        const user: User = this.users.find((user) => user.username === username);
        user.password = await bcrypt.hash(user.password, 10);
        return user;
    }

    async deleteUser(user: User): Promise<boolean> {
        return true;
    }


}