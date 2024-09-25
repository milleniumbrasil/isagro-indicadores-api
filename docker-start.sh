#!/bin/bash

# Define a variável de ambiente DATABASE_URL
case $1 in
  local)
    DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/app?serverVersion=15&charset=utf8"
    ;;
  desenv)
    DATABASE_URL="postgresql://postgres:postgres@desenv:5432/app?serverVersion=15&charset=utf8"
    ;;
esac

# Inicia o Docker Compose
docker-compose up