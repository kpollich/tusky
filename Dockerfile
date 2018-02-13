FROM node:8-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . . 

ENV ENDPOINT public

CMD ["yarn", "start"]
