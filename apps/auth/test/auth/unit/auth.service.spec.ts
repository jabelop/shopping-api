import { Test, TestingModule } from '@nestjs/testing';

import { JwtService } from '@nestjs/jwt';
import { UserRepositoryTest } from './userRespositoryTest';
import { UserRepository } from '../../../../../libs/shared/src/domain/user/user.repository';
import { AuthService } from '../../../src/application/auth.service';
import { UserMongoose } from '../../../src/infrastructure/db/mongo/user.schema';
import { randomUUID } from 'crypto';

const usersRepositoryProvider = {provide: UserRepository, useClass: UserRepositoryTest};

describe('AuthService', () => {
  let service: AuthService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [usersRepositoryProvider, JwtService, UserMongoose, AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save an user', async () => {
    expect(await service.save({id: randomUUID(), username: "test3", password: "test3Password"})).toBe(true);
  });

  it('should login an existing user', async () => {
    expect(await service.login({id: randomUUID(), username: "test1", password: "test1Password"})).toBeTruthy();
  });
});
