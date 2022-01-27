import { Server } from 'http';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { getConnection } from 'typeorm';
import app from '../server';
import config from '../utils/config';
import dbBootstrap from '../db/bootstrap';
import Movie from '../db/entities/Movie';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

let server: Server;

const basicUserToken = jwt.sign(
    { userId: 1, role: 'basic' },
    config.JWT_SECRET,
  ),
  premiumUserToken = jwt.sign(
    { userId: 2, role: 'premium' },
    config.JWT_SECRET,
  );

const movieObjectFromOmdb = {
  data: {
    Title: 'The Mask2222',
    Released: '29 Jul 1994',
    Director: 'Chuck Russell',
    Genre: 'Action, Comedy, Crime',
  },
};

beforeAll(async () => {
  server = await app.listen(config.MOVIES_PORT, () => {
    console.log(
      `⚡️[server]: Test server is running at https://localhost:${config.MOVIES_PORT}`,
    );
  });
  await dbBootstrap();
});

afterAll(async () => {
  const connection = getConnection();
  const entities = connection.entityMetadatas;
  entities.forEach(async (entity) => {
    const repository = connection.getRepository(entity.name);
    await repository.query(`DELETE FROM ${entity.tableName}`);
  });

  await server?.close();
});

describe('Movies controller', () => {
  describe('Test movie creation', () => {
    it('Getting movies. Should return 200 and empty array of movies', async () => {
      const response = await request(app)
        .get(`/movies`)
        .set('Authorization', 'Bearer ' + premiumUserToken);
      expect(response.body).toEqual([]);
      expect(response.statusCode).toEqual(200);
    });

    it('Creating movie. Should return 201 and created movie object', async () => {
      mockedAxios.get.mockResolvedValue(movieObjectFromOmdb);
      const response = await request(app)
        .post(`/movies`)
        .send({
          title: 'The mask',
        })
        .set('Authorization', 'Bearer ' + premiumUserToken);

      expect(response.body.title).toEqual(movieObjectFromOmdb.data.Title);
      expect(response.statusCode).toEqual(201);
    });

    it('Getting movies. Should return 200 and created movie object', async () => {
      const response = await request(app)
        .get(`/movies`)
        .set('Authorization', 'Bearer ' + premiumUserToken);
      const movies = response.body as Movie[];
      expect(response.statusCode).toEqual(200);
      expect(movies.length).toEqual(1);
      expect(movies[0].title).toEqual(movieObjectFromOmdb.data.Title);
    });
  });

  describe('Test limitation of 5 movies per month for basic user', () => {
    it('Creating movies. Should return 201 for all requests', async () => {
      const requests = [];
      for (let i = 0; i < 5; i++) {
        requests.push(
          request(app)
            .post(`/movies`)
            .send({
              title: 'The mask',
            })
            .set('Authorization', 'Bearer ' + basicUserToken)
            .expect(201),
        );
      }
      await Promise.all(requests);
    });

    it('Creating 6th movie per month. Should return 403', async () => {
      mockedAxios.get.mockResolvedValue(movieObjectFromOmdb);
      const response = await request(app)
        .post(`/movies`)
        .send({
          title: 'The mask',
        })
        .set('Authorization', 'Bearer ' + basicUserToken);

      expect(response.statusCode).toEqual(403);
    });
  });

  describe('Test limitation of 5 movies per month for premium user', () => {
    it('Creating movies. Should return 201 for all requests', async () => {
      const requests = [];
      for (let i = 0; i < 5; i++) {
        requests.push(
          request(app)
            .post(`/movies`)
            .send({
              title: 'The mask',
            })
            .set('Authorization', 'Bearer ' + premiumUserToken)
            .expect(201),
        );
      }
      await Promise.all(requests);
    });

    it('Creating 6th movie per month. Should return 201', async () => {
      mockedAxios.get.mockResolvedValue(movieObjectFromOmdb);
      const response = await request(app)
        .post(`/movies`)
        .send({
          title: 'The mask',
        })
        .set('Authorization', 'Bearer ' + premiumUserToken);

      expect(response.statusCode).toEqual(201);
    });
  });
});
