let fs = require('fs')

let countryCodeMap = JSON.parse(fs.readFileSync('country_code_nation_map.json'))
let cultureMap = new Map([
    ["byssian", []],
    ["dwarf", []],
    ["dragonborn", []],
    ["fang-kin", []],
    ["ihmisi", []],
    ["gwerin", []],
    ["wall-builder", []],
    ["auringon", []],
    ["orc", []],
    ["other", []],
    ["ship-folk", []]
])

for (let key in countryCodeMap) {
    let cultures = countryCodeMap[key];
    if (!Array.isArray(cultures)) {
        continue
    }
    if (cultures.length == 0) {
        let other = cultureMap.get('other')
        other.push(key)
        cultureMap.set('other', other)
        continue
    }
    for (let c of cultures) {
        let target = cultureMap.get(c)
        if (!target) {
            console.error(`Could not find entry for culture ${c} (sourced from ${key})!`)
            continue
        }
        target.push(key)
        cultureMap.set(c, target)
    }
}

fs.writeFileSync('culture_country_code_map.json', JSON.stringify(Object.fromEntries(cultureMap.entries()), null, 2))