
#  Dockerfile for Node Express Backend api (development)

FROM node:10.16-alpine

ARG NODE_ENV=development

# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
COPY . . 

RUN npm ci

# Copy app source code
COPY . .

# Exports
EXPOSE 5000

CMD ["npm","start"]