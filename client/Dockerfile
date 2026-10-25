FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# If using Next.js:
ENV PORT=3000
EXPOSE 3000

CMD ["npm", "run", "dev"]
