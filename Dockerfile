FROM node:10.19-alpine AS build

ARG APP_VERSION
ENV REACT_APP_VERSION=$APP_VERSION

COPY . .
RUN npm ci
RUN npm run build

FROM nginx:1.17-alpine

ARG APP_VERSION
ENV APP_VERSION=$APP_VERSION

RUN apk update
RUN apk add --no-cache curl

COPY --from=build ./build/ /usr/share/nginx/html
COPY ./entrypoint.sh /bin/entrypoint.sh

ENTRYPOINT ["/bin/entrypoint.sh"]
