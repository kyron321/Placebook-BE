const {
  selectTopics,
  selectArticles,
  selectArticlesByID,
  selectCommentsByArticleID,
  insertComment,
  checkIfArticleIDExists,
  patchArticle
} = require("../models/models.js");

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

exports.getCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  const promises = [
    selectCommentsByArticleID(article_id),
    checkIfArticleIDExists(article_id),
  ];
  Promise.all(promises)
    .then(([comments]) => {
      return res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;

  insertComment(article_id, newComment)
    .then((comment) => {
      return res.status(201).send({ comment });
    })
    .catch(next);
};

exports.updateArticle = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;

  patchArticle(inc_votes, article_id)
    .then((article) => {
      res.status(202).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};