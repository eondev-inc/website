# Stage 1: Build
FROM node:lts-alpine AS build-stage

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn run build

# Stage 2: Production
FROM node:lts-alpine AS production-stage

RUN yarn global add http-server

WORKDIR /app

COPY --from=build-stage /app/dist ./dist

EXPOSE 8080

CMD [ "http-server", "dist" ]
