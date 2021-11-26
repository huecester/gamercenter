FROM node:16
WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN ["yarn", "install"]

COPY . .
RUN ["yarn", "build"]

ENV NODE_ENV=production

ENV HOST=0.0.0.0
ENV PORT=8080

ENV PGDATABASE=gamercenter

CMD ["yarn", "start"]
