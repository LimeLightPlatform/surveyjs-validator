const PROBLEM_DETAILS_TYPE = "application/problem+json";

function problem_details(type, title, details) {
  return {
    type: type,
    title: title,
    details: details,
  };
}

function error_invalid_json(details) {
  return problem_details(
    "https://github.com/LimeLightPlatform/surveyjs-validator/wiki/JsonParsingError",
    "Invalid JSON",
    details,
  );
}

function error_schema_missing() {
  return problem_details(
    "https://github.com/LimeLightPlatform/surveyjs-validator/wiki/SchemaMissingError",
    "Schema Missing",
    "request payload must contain `schema`, a SurveyJS schema",
  );
}

function error_data_missing() {
  return problem_details(
    "https://github.com/LimeLightPlatform/surveyjs-validator/wiki/DataMissingError",
    "Data Missing",
    "request payload must contain `data`, a SurveyJS form submission",
  );
}

function error_schema_validation(schema_errors) {
  return {
    ...problem_details(
      "https://github.com/LimeLightPlatform/surveyjs-validator/wiki/SchemaValidationError",
      "Schema Validation Failed",
      "see schema_errors",
    ),
    ...{ schema_errors: schema_errors },
  };
}

function error_data_validation(data_errors) {
  return {
    ...problem_details(
      "https://github.com/LimeLightPlatform/surveyjs-validator/wiki/DataValidationError",
      "Data Validation Failed",
      "see data_errors",
    ),
    ...{ data_errors: data_errors },
  };
}

module.exports = {
  PROBLEM_DETAILS_TYPE,
  error_invalid_json,
  error_schema_missing,
  error_data_missing,
  error_schema_validation,
  error_data_validation,
};
