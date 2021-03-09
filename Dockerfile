FROM node:10.19-alpine AS build

ARG IMAGE_TAG
RUN echo "Look at args ${IMAGE_TAG}"
ENV BEEP=$IMAGE_TAG
RUN echo "Look at env ${BEEP}"

COPY . .
RUN npm ci
RUN npm run build

FROM nginx:1.17-alpine
RUN apk update
RUN apk add --no-cache curl

COPY --from=build ./build/ /usr/share/nginx/html
COPY ./entrypoint.sh /bin/entrypoint.sh

ENTRYPOINT ["/bin/entrypoint.sh"]
