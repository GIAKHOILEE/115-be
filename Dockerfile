FROM node:21 AS development

WORKDIR /app

COPY package.json ./

RUN yarn install

COPY . .

ENV PORT=$PORT

EXPOSE $PORT

CMD ["yarn", "start"]
