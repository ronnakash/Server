#!/bin/sh

TAG=server
PORT=3001

docker build -t name:$TAG .
docker run -dp $PORT:$PORT $TAG