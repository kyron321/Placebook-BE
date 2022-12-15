const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => {
  db.end();
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
      .get("/api/articles/1")
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: 1,
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });

  test("status 404: invalid data (article_id doesn't exist)", () => {
    return request(app)
      .get(`/api/articles/627361`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });

  test("status 400: incorrect data format (article_id isn't a number)", () => {
    return request(app)
      .get(`/api/articles/thisiswrong`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
});

describe("GET/api/articles/:article_id/comments", () => {
  test("responds with a status of 200, returns an array of comments with the corrosponding article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        comments.forEach((comment) => {
          expect(comment.article_id).toBe(1);
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });
  test("responds with a status of 200, returns an array of comments with the corrosponding article_id sorted by the newest comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toBeSortedBy("created_at", { descending: true });
        comments.forEach((comment) => {
          expect(comment.article_id).toBe(1);
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });
  test("responds with a 404 error when passed a article id which doesnt exist", () => {
    return request(app)
      .get("/api/articles/464646/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });

  test("responds with a 400 error when passed an article id formatted incorrectly", () => {
    return request(app)
      .get("/api/articles/incorrectformat/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("responds status 201 with an object containing the new comment", () => {
    const newComment = {
      username: "icellusedkars",
      body: "testing post",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const {comment} = body
        expect(comment).toEqual({
          comment_id: expect.any(Number),
          body: "testing post",
          article_id: 1,
          author: "icellusedkars",
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("responds status 404 when passed a valid but not existent article_id value",()=>{
    const newComment = {
      username: "icellusedkars",
      body: "testing post",
    };
    return request(app)
      .post("/api/articles/56456746/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  })
});
