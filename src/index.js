const {
  PROBLEM_DETAILS_TYPE,
  error_invalid_json,
  error_schema_missing,
  error_data_missing,
  error_schema_validation,
  error_data_validation,
} = require("./errors.js");
const { count_error } = require("./tracing.js");

const express = require("express");
const process = require("process");
const path = require("path");
const app = express();
const surveyjs = require("survey-core");
const port = 3000;

global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
global.XMLHttpRequest = XMLHttpRequest;

// serve api docs at /
app.use(express.static(path.join("api-docs")));

app.use(express.json(), (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res
      .status(400)
      .type(PROBLEM_DETAILS_TYPE)
      .json(count_error(error_invalid_json(err.message)));
  }
  next();
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

app.post("/validate", (req, res) => {
  if (req.body.schema === undefined) {
    res
      .status(400)
      .type(PROBLEM_DETAILS_TYPE)
      .json(count_error(error_schema_missing()));
    return;
  }
  if (req.body.data === undefined) {
    res
      .status(400)
      .type(PROBLEM_DETAILS_TYPE)
      .json(count_error(error_data_missing()));
    return;
  }

  const survey = new surveyjs.SurveyModel(req.body.schema);
  if (survey.jsonErrors) {
    res
      .status(400)
      .type(PROBLEM_DETAILS_TYPE)
      .json(count_error(error_schema_validation(survey.jsonErrors)));
    return;
  }

  survey.data = req.body.data;
  //survey.clearIncorrectValues(true) TODO should we clear these, the original does
  let valid = survey.validate();

  let errors = [];
  let questions = survey.getAllQuestions(true);
  for (let question of questions) {
    ``;
    errors.push(question.errors);
  }
  errors = errors.flatMap((e) => e);

  // TODO The original code README hints at comparing the data before & after validation to catch invalid option
  //  selections, verify if this is true and if it's required.
  if (valid) {
    res.status(200).type("application/json").json({});
  } else {
    res
      .status(400)
      .type(PROBLEM_DETAILS_TYPE)
      .json(count_error(error_data_validation(errors)));
  }
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

process.on("SIGINT", () => {
  console.log("\nShutting down server...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
