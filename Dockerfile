FROM node:18.19.0 as builder

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 1227

CMD [ "yarn", "run", "start" ]
