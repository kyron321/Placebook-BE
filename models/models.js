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
  const queryStr = `
  SELECT * FROM articles 
  WHERE article_id=$1`;
  const queryVals = [article_id];
  return db.query(queryStr, queryVals).then((article) => {
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
  let queryStr = `
  SELECT * FROM comments 
  WHERE article_id = $1
  ORDER BY created_at DESC;`

  return db.query(queryStr, [article_id]).then(({ rows }) => {
    return rows;
  });
};

exports.checkIfArticleIDExists = (article_id) => {
  const queryStr = `
    SELECT *
    FROM articles
    WHERE article_id = $1;`;

  return db.query(queryStr, [article_id]).then(({ rowCount }) => {
    if (rowCount === 0) {
      return Promise.reject({
        status: 404,
        msg: `Bad request`,
      });
    } else {
      return true;
    }
  });
};

exports.insertComment = (article_id, newComment) => {
  const { username, body } = newComment;

  let queryStr = `
  INSERT INTO comments (body, article_id, author) 
  VALUES ($1, $2, $3) 
  RETURNING *;`;

  return db.query(queryStr, [body, article_id, username]).then(({ rows }) => {
    return rows[0];
  });
};

exports.patchArticle = (vote, article_id) => {
  const queryStr = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`;

  return db.query(queryStr, [vote, article_id]).then((updatedArticle) => {
    if (updatedArticle.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Bad request" });
    } else {
      return updatedArticle.rows[0];
    }
  });
};