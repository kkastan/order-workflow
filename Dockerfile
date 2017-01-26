FROM node:7.4.0

RUN npm install -g nodemon

WORKDIR /app
ADD package.json /app/package.json
RUN npm install

ADD . /app

VOLUME [ "/app" ]
EXPOSE 8080
