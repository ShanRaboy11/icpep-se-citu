FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies first (leveraging Docker layer caching)
COPY package*.json ./
COPY package-lock.json* ./
COPY tsconfig.json ./

# Copy source files needed by the TypeScript build so postinstall (tsc) succeeds
COPY src ./src

RUN npm install --silent

# Copy remaining files
COPY . .

ENV PORT=5000
EXPOSE 5000

# Development command; for production change to `npm run start` after build
CMD ["npm", "run", "dev"]