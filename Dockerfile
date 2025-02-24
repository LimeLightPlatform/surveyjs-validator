FROM node:22.14.0-alpine3.21

RUN mkdir /opt/surveyjs-validator
ADD src /opt/surveyjs-validator
ADD api-docs /opt/surveyjs-validator
ADD package-lock.json /opt/surveyjs-validator
ADD package.json /opt/surveyjs-validator

WORKDIR /opt/surveyjs-validator
RUN npm ci

EXPOSE 3000
EXPOSE 9464
ENTRYPOINT ["/usr/local/bin/node", "index.js"]
