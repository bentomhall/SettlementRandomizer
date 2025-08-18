#!/bin/bash
curl -s -o /dev/null -X POST -H "Content-Type: application/json" --data @city_names.json 'http://localhost:8080/names/bulk'
curl -s -o /dev/null -X POST -H "Content-Type: application/json" --data @nameInput.json 'http://localhost:8080/names/bulk'
curl -s -o /dev/null -X POST -H "Content-Type: application/json" --data @bulk_lineages.json 'http://localhost:8080/lineages/bulk'
curl -s -o /dev/null -X POST -H "Content-Type: application/json" --data @fangkin.culture.json 'http://localhost:8080/cultures'