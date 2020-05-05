process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app.js');
const connection = require('../db/connection');

beforeEach(() => { return connection.seed.run() });
afterAll(() => { return connection.destroy() });

describe('app', () => {
  describe('/api', () => {
    describe('/topics', () => {
      describe('GET method', () => {
        test('Status:200 responds with array of topics objects', () => {
          return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
              expect(Array.isArray(body.topics)).toBe(true);
              expect(body.topics.length).toBe(3);
            });
        });
        test('Status:200 each topics object has slug and description properties', () => {
          return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
              body.topics.forEach((topic) => {
                expect(Object.keys(topic)).toEqual(expect.arrayContaining(['slug', 'description']));
              })
            })
        })
      });
    });
    describe('/users/:username', () => {
      describe('GET method', () => {
        test('Status:200 responds with the correct user object based on a username parametric endpoint', () => {
          return request(app)
            .get('/api/users/rogersop')
            .expect(200)
            .then(({ body }) => {
              expect(typeof body.user).toBe('object');
            });
        });
        test('Status:200 returned user object includes properties username, name and avatar_url', () => {
          return request(app)
            .get('/api/users/rogersop')
            .expect(200)
            .then(({ body }) => {
              expect(Object.keys(body.user)).toEqual(expect.arrayContaining(['username', 'name', 'avatar_url']));
            });
        });
      });
    });
  });
});