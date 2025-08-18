#!/bin/bash
curl -s -o /dev/null -X POST -H "Content-Type: application/json" --data @city_names.json 'http://localhost:8080/names/bulk'