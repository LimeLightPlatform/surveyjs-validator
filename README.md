# SurveyJS Server Validation

Server validation is done by passing both the survey structure as well as the survey data to the service.
Use a `POST` request with JSON content, pass in the following structure:

```json
{
  "survey": {/* Survey structure here */},
  "data": {/* Survey data here */}
}

```

There is no security, run this in a non-publicly accessible container in your orchestration environment.


## Steps

1. We load the survey structure 
2. Load the data
3. Clear incorrect values
4. Check if the survey has validation errors
5. Check if the cleaned data is the same as the original data

Step 3 will remove values from the survey like choices in single choice questions that are not visible / available.
Step 4 will run data validation (required questions, explicit validators configured in the survey)
Step 5 is needed because passing in a value `D` to a question with options `A`, `B` and `C` will not trigger validation errors by default.
Instead step 3 will remove the value from the data and thus if the question is not mandatory it will pass validation.

Future extensions:
- Make some steps optional
- Return the cleaned data

## Status codes
200 All good
400 Bad structure of the JSON
406 If the `Accept` header does not accept JSON
415 Content type is not JSON
422 SurveyJS failed to parse the survey structure 

### Response 200
Body contains JSON according to the schema at https://github.com/HeRAMS-WHO/surveyjs-validator/response_schema.json
