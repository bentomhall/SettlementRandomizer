const fs = require('fs')

function randomChoice(lst) {
    let index = Math.floor(Math.random()*lst.length)
    return lst[index]
}

let culture = process.env[2] ?? "wall-builder"

let place_names = JSON.parse(fs.readFileSync('names_by_culture.json'))
let cultureNames = place_names[culture] ?? []
let otherNames = place_names['other'] ?? []

let isOther = Math.random() < 0.1;
console.log(isOther ? randomChoice(otherNames) : randomChoice(cultureNames))
