#!/bin/bash

echo "pulling"

git pull

echo "updated, now building"

docker-compose -f docker-compose.deploy.yml up -d --build
