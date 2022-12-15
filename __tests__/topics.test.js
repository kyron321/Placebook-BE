const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

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
})
