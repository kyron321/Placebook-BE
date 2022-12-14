const express = require("express");
const {
  handle500errors,
  handle404errors,

} = require("./controllers/controllers.errors");
const {
  getTopics,
  getArticles,
  getArticlesByArticleID,
} = require("./controllers/controllers.snacks");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticlesByArticleID);

app.all("*",handle404errors);
app.use(handle500errors);

module.exports = app;
