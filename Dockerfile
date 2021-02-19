FROM node:10-alpine

EXPOSE 3000

ARG NODE_ENV
ARG FONTAWESOME_NPM_AUTH_TOKEN
ARG API
ARG MAPBOX_TOKEN

ENV NODE_ENV ${NODE_ENV}
ENV HOST 0.0.0.0
ENV API ${API}
ENV MAPBOX_TOKEN ${MAPBOX_TOKEN}

RUN mkdir /app
WORKDIR /app
ADD package.json /app/
RUN npm config set "@fortawesome:registry" https://npm.fontawesome.com/
RUN npm config set "//npm.fontawesome.com/:_authToken" ${FONTAWESOME_NPM_AUTH_TOKEN}
RUN npm install
ADD . /app
RUN npm run build

CMD ["npm", "start"]
