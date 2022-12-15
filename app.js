const express = require("express");
const {
  handle500errors,
  handle404errors,
  handleCustomErrors,
  handlePsqlErrors
} = require("./controllers/controllers.errors");
const {
  getTopics,
  getArticles,
  getArticlesByArticleID,
  getCommentsByArticleID,
} = require("./controllers/controllers.app");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticlesByArticleID);

app.get("/api/articles/:article_id/comments", getCommentsByArticleID)

app.all("/*",handle404errors);
app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handle500errors);

module.exports = app;
