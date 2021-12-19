FROM node:16
WORKDIR /app

ENV NODE_ENV=production
COPY ["package.json", "yarn.lock", "."]
RUN ["yarn", "install"]

COPY . .
RUN ["yarn", "build"]

CMD ["yarn", "start"]
