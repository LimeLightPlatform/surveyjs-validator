# SurveyJS Server Validation

## How to Use
API docs are available at `/`. You can also view them by opening `api-docs/index.html` or rendering
`api-docs/surveyjs-validator.yaml` in any tool which supports OpenAPI 3.x.

### Validate Schema
To validate a SurveyJS schema before saving in the backend issue a POST request to `/validate/schema` with the following
JSON request body:
```json
{
  "schema": {
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "text",
            "name": "question",
            "isRequired": true
          }
        ]
      }
    ]
  }
}
```

If the service responds with an HTTP 200 then the schema is valid. Otherwise an error will be returned. All errors are
documented in the [wiki](https://github.com/LimeLightPlatform/surveyjs-validator/wiki). Errors follow RFC 7807 and
include a URL to the error documentation (wherever possible).

_Note: only the pages portion of the SurveyJS schema is validated._


### Validate Survey (Schema + Data)
To validate a survey submission, you'll have to provide the form Schema along with the submission data. Make a POST
request to `/validate/survey` with the following JSON request payload:
```json
{
  "schema": {
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "text",
            "name": "question",
            "isRequired": true
          }
        ]
      }
    ]
  },
  "data": {
    "question":"answer"
  }
}
```
Like the Schema validation endpoint, the service will respond with an HTTP 200 if the schema is valid and the data
matches the requirements described in the schema. Errors will be a 400 and are documented in the 
[wiki](https://github.com/LimeLightPlatform/surveyjs-validator/wiki).

## Authentication / Authorization
There is no authn/authz; run this in a non-publicly accessible container in your orchestration environment.

## Response
On successful validation an empty JSON object is returned. Please check the HTTP status code to check for success.

For errors, this API responds with RFC 7807 formatted Problem Details with specific error details.

### Status codes
- 200 Valid Schema and Data
- 400 Input and/or validation error (see response)

## Helm
A helm chart is provided under
[charts/surveyjs-validator](https://github.com/LimeLightPlatform/surveyjs-validator/tree/main/charts/surveyjs-validator).
Values can be found [here](https://github.com/LimeLightPlatform/surveyjs-validator/blob/main/charts/surveyjs-validator/values.yaml).

The helm chart supports ingress and a service monitor.

## Metrics & Tracing
This service tracks metrics and exports in prometheus format on port `9464`. You can view the metrics when running locally
via http://localhost:9464/metrics. The provided helm chart has an optional ServiceMonitor to scrape the provided metrics
(disabled by default).

Tracing is collected via OpenTelemetry. Tracing can be configured using OpenTelemetry
[environmental variables](https://opentelemetry.io/docs/languages/sdk-configuration/) or by  adjusting the
`openTelemetry` options in the Helm chart `values.yaml`.

## Credits
Thanks to HeRAMS-WHO for the original idea and implementation which can be found here:
https://github.com/HeRAMS-WHO/surveyjs-validator
