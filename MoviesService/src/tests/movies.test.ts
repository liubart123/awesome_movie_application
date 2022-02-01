import { Server } from 'http';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { getConnection } from 'typeorm';
import app from '../server';
import config from '../utils/config';
import dbBootstrap from '../db/bootstrap';
import Movie from '../db/entities/Movie';
import OmbdService from '../services/OmdbService';

let server: Server;

//#region additional functions

function* titleMaker() {
  let i = 0;
  while (true) {
    yield 'title' + i++;
  }
}

//#endregion

//#region const variables and mocks

const movieTitleenerator = titleMaker();

const OmdbServiceFetchMovieDataMock = jest.spyOn(
  OmbdService,
  'fetchAdditionalMovieDetails',
);

const basicUserToken = jwt.sign(
    { userId: 1, role: 'basic' },
    config.JWT_SECRET,
  ),
  premiumUserToken = jwt.sign(
    { userId: 2, role: 'premium' },
    config.JWT_SECRET,
  ),
  //fer testing movie creation
  premiumUserToken2 = jwt.sign(
    { userId: 3, role: 'premium' },
    config.JWT_SECRET,
  );

//#endregion

//#region AfterAll and beforeAll

beforeAll(async () => {
  server = await app.listen(config.MOVIES_PORT, () => {
    console.log(
      `⚡️[server]: Test server is running at https://localhost:${config.MOVIES_PORT}`,
    );
  });
  await dbBootstrap();

  OmdbServiceFetchMovieDataMock.mockImplementation(async (title: string) => {
    return {
      title: title,
      genre: 'genre',
      director: 'directore',
      released: new Date(),
    };
  });
});

afterAll(async () => {
  const connection = getConnection();
  const entities = connection.entityMetadatas;
  entities.forEach(async (entity) => {
    const repository = connection.getRepository(entity.name);
    await repository.query(`DELETE FROM ${entity.tableName}`);
  });

  await server?.close();

  OmdbServiceFetchMovieDataMock.mockRestore();
});

//#endregion

describe('Movies controller', () => {
  describe('Test movie creation', () => {
    it('Getting movies. Should return 200 and empty array of movies', async () => {
      const response = await request(app)
        .get(`/movies`)
        .set('Authorization', 'Bearer ' + premiumUserToken2);
      expect(response.body).toEqual([]);
      expect(response.statusCode).toEqual(200);
    });

    const movieTitle = movieTitleenerator.next().value;
    let movieId: number;

    it('Creating movie. Should return 201 and created movie object', async () => {
      const response = await request(app)
        .post(`/movies`)
        .send({
          title: movieTitle,
        })
        .set('Authorization', 'Bearer ' + premiumUserToken2);

      expect(response.body.title).toEqual(movieTitle);
      expect(response.statusCode).toEqual(201);
      movieId = response.body.id;
    });

    it('Getting movies. Should return 200 and created movie object', async () => {
      const response = await request(app)
        .get(`/movies`)
        .set('Authorization', 'Bearer ' + premiumUserToken2);
      const movies = response.body as Movie[];
      expect(response.statusCode).toEqual(200);
      expect(movies.length).toEqual(1);
      expect(movies[0].title).toEqual(movieTitle);
    });

    it('Getting one movie. Should return 200 and created movie object', async () => {
      const response = await request(app)
        .get(`/movies/${movieId}`)
        .set('Authorization', 'Bearer ' + premiumUserToken2);
      const movies = response.body as Movie;
      expect(response.statusCode).toEqual(200);
      expect(movies.title).toEqual(movieTitle);
    });
  });

  describe('Test limitation of 5 movies per month for basic user', () => {
    it('Creating movies in January. Should return 201 for 5 requests and 403 for 6th request', async () => {
      //setting current time as last second of January
      const mockDate = new Date(2022, 0, 31, 23, 59, 59);
      const RealDate = Date;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as any).Date = class extends RealDate {
        constructor() {
          super();
          return mockDate;
        }
      };

      const requests = [];
      for (let i = 0; i < 5; i++) {
        requests.push(
          request(app)
            .post(`/movies`)
            .send({
              title: movieTitleenerator.next().value,
            })
            .set('Authorization', 'Bearer ' + basicUserToken)
            .expect(201),
        );
      }
      await Promise.all(requests);

      const response = await request(app)
        .post(`/movies`)
        .send({
          title: movieTitleenerator.next().value,
        })
        .set('Authorization', 'Bearer ' + basicUserToken);

      expect(response.statusCode).toEqual(403);

      global.Date = RealDate;
    });

    it('Creating movies in February. Should return 201 for 5 requests and 403 for 6th', async () => {
      //setting current time as first second of February
      const mockDate = new Date(2022, 1, 1, 0, 0, 0);
      const RealDate = Date;
      (global as any).Date = class extends RealDate {
        constructor() {
          super();
          return mockDate;
        }
      };

      const requests = [];
      for (let i = 0; i < 5; i++) {
        requests.push(
          request(app)
            .post(`/movies`)
            .send({
              title: movieTitleenerator.next().value,
            })
            .set('Authorization', 'Bearer ' + basicUserToken)
            .expect(201),
        );
      }
      await Promise.all(requests);
      const response = await request(app)
        .post(`/movies`)
        .send({
          title: movieTitleenerator.next().value,
        })
        .set('Authorization', 'Bearer ' + basicUserToken);

      expect(response.statusCode).toEqual(403);

      global.Date = RealDate;
    });
  });

  describe('Test limitation of 5 movies per month for premium user', () => {
    it('Creating movies in January. Should return 201 for all requests', async () => {
      const requests = [];
      for (let i = 0; i < 5; i++) {
        requests.push(
          request(app)
            .post(`/movies`)
            .send({
              title: movieTitleenerator.next().value,
            })
            .set('Authorization', 'Bearer ' + premiumUserToken)
            .expect(201),
        );
      }
      await Promise.all(requests);
    });

    it('Creating 6th movie in January. Should return 201', async () => {
      const response = await request(app)
        .post(`/movies`)
        .send({
          title: movieTitleenerator.next().value,
        })
        .set('Authorization', 'Bearer ' + premiumUserToken);

      expect(response.statusCode).toEqual(201);
    });
  });
});
