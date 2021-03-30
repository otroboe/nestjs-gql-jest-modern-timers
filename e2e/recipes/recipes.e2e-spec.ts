import { join } from 'path';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GraphQLModule } from '@nestjs/graphql';

import { RecipesModule } from '../../src/recipes/recipes.module';

describe('Recipes', () => {
  const query = 'query { recipes { id } }';
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        RecipesModule,
        GraphQLModule.forRoot({
          autoSchemaFile: join(process.cwd(), 'schema.gql'),
          installSubscriptionHandlers: true,
        }),
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET recipes`, async () => {
    await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200)
      .expect({
        data: {
          recipes: [],
        },
      });
  });

  it(`/GET recipes with modern timers ON`, async () => {
    jest.useFakeTimers('modern');

    await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200)
      .expect({
        data: {
          recipes: [],
        },
      });

    jest.useRealTimers();
  });

  afterAll(async () => {
    await app.close();
  });
});
