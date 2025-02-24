# SurveyJS Server Validation

## How to Use
API docs are available at `/`. You can also view them by opening `api-docs/index.html` or rendering
`api-docs/surveyjs-validator.yaml` in any tool which supports OpenAPI 3.x.

Server validation is done by passing both the survey structure and data to the service.
Use a `POST` request to `/validate` with JSON content, pass in the following structure:

```json
{
  "schema": {},
  "data": {}
}
```

Where `schema` is the SurveyJS survey (only the pages portion is required) and `data` is the form submission data from
SurveyJS.

### Example Payload
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
            "isRequired": true,
            "validators": [
              {
                "type": "text",
                "text": "what",
                "minLength": 1
              }
            ]
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

There is no security, run this in a non-publicly accessible container in your orchestration environment.

## Response
On successful validation an empty JSON object is returned. Please check the HTTP status code to check for success.

For errors, this API responds with RFC 7807 formatted Problem Details with specific error details.

### Status codes
- 200 Valid Schema and Data
- 400 Input and/or validation error (see response)


## Credits
Thanks to HeRAMS-WHO for the original idea and implementation which can be found here:
https://github.com/HeRAMS-WHO/surveyjs-validator
