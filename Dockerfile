FROM node:17

WORKDIR /code

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]