#!/bin/bash

echo "pulling"

git pull

echo "updated, now building"

docker-compose up -d --build
