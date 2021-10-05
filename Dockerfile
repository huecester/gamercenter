# Setup
FROM node:16
WORKDIR /app

ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080 8080

# Install packages
COPY package.json .
COPY yarn.lock .

RUN yarn install

# Copy other files
COPY public public
COPY dist dist
COPY src/server src/server
COPY server.js .

# Start
CMD ["node", "."]
