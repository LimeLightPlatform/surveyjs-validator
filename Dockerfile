FROM node
RUN mkdir /project
ADD app.js /project
ADD package-lock.json /project
ADD package.json /project
WORKDIR /project
RUN npm i
ENTRYPOINT ["/usr/local/bin/node", "/project/app.js"]
