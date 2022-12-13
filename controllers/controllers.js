const {
  selectTopics,
  selectArticles,
  selectArticlesByID,
} = require("../models/models.js");

exports.pathInvalid = (req, res) => {
  res.status(404).send({ message: "Invalid API path request" });
};

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticlesByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  selectArticlesByID(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
