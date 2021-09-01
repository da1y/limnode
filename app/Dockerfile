FROM node:16-alpine3.11

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install
RUN npm install -g pm2

COPY index.js ./

EXPOSE 3000

CMD npm run start