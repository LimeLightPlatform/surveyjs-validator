const http = require('http');

const surveyjs = require('survey-core');
const hostname = '';
const port = 80;

const survey = new surveyjs.SurveyModel({
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "radiogroup",
          "name": "question1",
          "isRequired": true,
          // "validators": [
          //   {
          //     "type": "expression",
          //     "expression": "{question1} anyof ['item1', 'item2', 'item3']"
          //   }
          // ],
          "choices": [
            "item1",
            "item2",
            "item3"
          ]
        }
      ]
    }
  ]
});

const server = http.createServer((request, response) => {
  if (request.method === 'POST') {
    let body = ''
    request.on('data', (data) => body += data);
    request.on('end', () => {
      survey.clear(true, true);
      const data = JSON.parse(body);
      survey.data = data;
      survey.clearIncorrectValues(true);
      if (survey.hasErrors())
      {
        response.statusCode = 422;
        response.setHeader('Content-Type', 'text/plain');
        response.end('Validation failed');

      } else {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        response.end('Validation OK');
      }
    });
  } else {
    response.statusCode = 405;
    response.setHeader('Content-Type', 'text/plain');
    response.end('Only POST is supported');
  }


});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  console.log()
});
