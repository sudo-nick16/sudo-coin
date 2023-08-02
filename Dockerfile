FROM node:20-alpine3.17 as build

WORKDIR /sudocoin

COPY ["package.json", "yarn.lock", "./"]
COPY ./server/package.json ./server/
COPY ./server/tsconfig.json ./server/
COPY ./web/package.json ./web/
COPY ./web/tsconfig.json ./web/

RUN yarn install

COPY ./server/ ./server/
COPY ./web/ ./web/

RUN yarn server build  && yarn web build

FROM node:20-alpine3.17 as prod

ENV NODE_ENV=production

WORKDIR /sudocoin

COPY ["package.json", "yarn.lock", "./"]

COPY ./server/package.json ./server/
COPY ./web/package.json ./web/

RUN yarn install --production

COPY --from=build sudocoin/server/dist ./server/dist/
COPY --from=build sudocoin/server/public ./server/public/

CMD ["yarn", "server", "start"]
