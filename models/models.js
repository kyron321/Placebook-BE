const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
};

exports.selectArticles = () => {
  return db
    .query(
      `
  SELECT articles.*, 
  COUNT(comment_id) AS comment_count FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY created_at DESC;`
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectArticlesByID = (article_id) => {
  const queryText = `
  SELECT * FROM articles 
  WHERE article_id=$1`;
  const queryVals = [article_id];
  return db.query(queryText, queryVals).then((article) => {
    if (article.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Bad request",
      });
    } else {
      return article.rows[0];
    }
  });
};

exports.selectCommentsByArticleID = (article_id) => {
  const queryStr = `
  SELECT * FROM comments 
  WHERE article_id = $1
  ORDER BY created_at DESC;`;

  return db.query(queryStr, [article_id]).then((articleComments) => {
    if (articleComments.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Bad request",
      });
    } else {
      return articleComments.rows;
    }
  });
};
