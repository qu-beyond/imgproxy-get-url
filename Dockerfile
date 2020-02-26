FROM node:12.14.0-alpine

ARG NODE_ENV=production

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Build app
COPY . /usr/src/app/
RUN yarn install --production=false && yarn build

ENV HOST 0.0.0.0
EXPOSE 3000

# start command
CMD [ "yarn", "start" ]