import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';

describe('AppController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should response 200 on GET /user', () => {
    return request(app.getHttpServer())
      .get('/user/1')
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });
});
