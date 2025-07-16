const fs = require('fs')

const placeNames = JSON.parse(fs.readFileSync('filtered_geonames.json'))
const country_culture_map = JSON.parse(fs.readFileSync('country_code_nation_map.json'))
let cultureMap = {
    "byssian": [],
    "dwarf": [],
    "dragonborn": [],
    "fang-kin": [],
    "ihmisi": [],
    "gwerin": [],
    "wall-builder": [],
    "auringon": [],
    "orc" : [],
    "other": [],
    "ship-folk": []
}


for (let countryCode in placeNames) {
    let names = placeNames[countryCode]
    if (names.length == 0) {
        continue
    }
    let cultures = country_culture_map[countryCode];
    if (cultures.length == 0) {
        cultures = ["other"]
    }
    for (let culture of cultures) {
        cultureMap[culture].push(...names)
    }
}

fs.writeFileSync('names_by_culture.json', JSON.stringify(cultureMap, null, 2));