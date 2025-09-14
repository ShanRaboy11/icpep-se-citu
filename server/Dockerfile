# Use a lighter version of Node
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# If you have build steps (TypeScript, etc.), you’d do them here
# COPY . .
# RUN npm run build

# Copy everything else
COPY . .

# Expose port (match your server port)
ENV PORT=5000
EXPOSE 5000

# Use nodemon in dev; in prod normal start
CMD ["npm", "run", "dev"]
