const handle404errors = (req, res, next) => {
  res.status(404).send({ message: "Invalid API path request" });
};

const handle500errors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "Server Error!" });
};

module.exports = {
  handle404errors,
  handle500errors,
};
