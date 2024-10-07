const chalk = require("chalk");

const createError = (validator, error) => {
  error.status = error.status || 400;
  error.message = `${error.status} | ${validator} Error: ${error.message}`;
  throw new Error(error);
};

const handleError = (res, status, message = "") => {
  console.log(chalk.redBright(message));
  return res.status(status).send(message);
};

module.exports = { createError, handleError };
