FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./ 

RUN npm install


FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY . . 

RUN npm install

ENV PORT=5000
EXPOSE 5000

CMD ["npm", "run", "dev"]