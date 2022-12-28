FROM node:18-alpine as dev

COPY package*.json /app/
WORKDIR /app/

RUN npm install -loglevel verbose
COPY . /app/
CMD npm start
