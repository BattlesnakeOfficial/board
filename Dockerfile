FROM node:10.7.0-alpine AS build

COPY . .
RUN npm ci
RUN npm run build

FROM nginx:1.15.2-alpine
RUN apk add --no-cache curl

ARG app_version
ENV APP_VERSION=${app_version}

COPY --from=build ./build/ /usr/share/nginx/html
COPY ./entrypoint.sh /bin/entrypoint.sh

ENTRYPOINT /bin/entrypoint.sh $APP_VERSION
