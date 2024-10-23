#!/bin/bash

cd .docker
docker compose up --build -d

cd ..
bash load.sh
