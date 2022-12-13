const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("News API", () => {
  describe("Invalid Paths", () => {
    test("repsonds with a status of 404 when given an invalid path", () => {
      return request(app)
        .get("/api/notapath")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Invalid API path request");
        });
    });
  });

  describe("GET /api/topics", () => {
    test("responds with a status of 200 and returns topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;
          expect(topics.length).toEqual(3);
          topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String),
              })
            );
          });
        });
    });
  });

  describe("GET/api/articles", () => {
    test("responds with a status of 200 and returns an array of objects containing the articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toEqual(12);
          articles.forEach((article) =>
            expect(article).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
            })
          );
        });
    });

    test("responds status 200 and returns an array of article objects sorted by a descending date order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toEqual(12);
          expect(articles).toBeSortedBy("created_at", { descending: true });
          articles.forEach((article) =>
            expect(article).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
            })
          );
        });
    });
  });

  describe("GET/api/articles/:article_id", () => {
    test("responds with a status of 200 and returns an array containing properties corresponding to the queried article_id", () => {
      return request(app)
        .get(`/api/articles/1`)
        .then(({ body }) => {
          const { article } = body;

          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 1,
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
        });
    });
  });
});
