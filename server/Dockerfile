FROM golang:latest
WORKDIR /app

COPY . .
RUN [ "go", "mod", "tidy", "-v" ]

ENV PORT=3000
ENV GIN_MODE=release
RUN [ "go", "install", "-v" ]

ENV PGDATABASE=gamercenter
CMD [ "server" ]
