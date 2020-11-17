FROM node:12

RUN npm install -g nodemon

WORKDIR /app

COPY src/package*.json ./

RUN npm install

COPY src/ .

EXPOSE 3000

CMD [ "nodemon" ]