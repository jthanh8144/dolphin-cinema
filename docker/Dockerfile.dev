ARG NODE_IMAGE=node:16.16.0-alpine
ARG APP_PORT=3000

# =====================================
# ======= DOCKERFILE FOR LOCAL ========
# =====================================
FROM ${NODE_IMAGE}

WORKDIR /home/app

RUN apk update && apk upgrade && apk add --no-cache bash git

EXPOSE $APP_PORT
