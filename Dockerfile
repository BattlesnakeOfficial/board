FROM node:10.7.0-alpine AS build

COPY . .
RUN npm i
RUN npm run build

FROM nginx:1.15.2-alpine
RUN apk add --no-cache curl

COPY --from=build ./build/ /usr/share/nginx/html
COPY ./entrypoint.sh /bin/entrypoint.sh

ENTRYPOINT [ "/bin/entrypoint.sh" ]
