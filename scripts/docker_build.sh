#!/bin/bash
cd server
docker buildx build --platform=linux/amd64,linux/arm64 -t huecester/gamercenter --push .
