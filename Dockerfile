FROM node:10

ENV APP_ROOT /src

RUN mkdir ${APP_ROOT}
WORKDIR ${APP_ROOT}
ADD . ${APP_ROOT}

RUN yarn
RUN yarn run build

ENV HOST 0.0.0.0