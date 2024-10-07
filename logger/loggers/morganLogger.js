const morgan = require("morgan");
const { currentTime } = require("../../utils/timeHelper");
const chalk = require("chalk");
const { makeLogsFolder, makeLogsFiles } = require("./fileLogger");

const morganLogger = morgan(function (tokens, req, res) {
  const { year, month, day, hours, minutes, seconds } = currentTime();

  let message = [
    `[${year}/${month}/${day} ${hours}:${minutes}:${seconds}]`,
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    "-",
    tokens["response-time"](req, res),
    "ms",
  ].join(" ");

  if (res.statusCode >= 400) {
    makeLogsFolder();
    makeLogsFiles(tokens.status(req, res), req.errorMessage);

    return chalk.redBright(message);
  } else {
    return chalk.greenBright(message);
  }
});

module.exports = morganLogger;
