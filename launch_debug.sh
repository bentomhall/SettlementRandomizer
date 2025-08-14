#!/bin/bash

export MYSQL_ROOT_PASSWORD='test'
export DB_PASSWORD='test1'

docker compose build && docker compose up

if [ -n $1 ]; then
    npm run schema
fi