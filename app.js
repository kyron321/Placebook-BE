const express = require("express");
const { getTopics, pathInvalid } = require("./controllers/controllers");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Server Error!");
});

app.all("*", pathInvalid);

module.exports = app;