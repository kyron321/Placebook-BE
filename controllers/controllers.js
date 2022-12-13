const { selectTopics, selectArticles } = require("../models/models.js");

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
