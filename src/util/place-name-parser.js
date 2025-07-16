let fs = require('fs')
let placeNames = JSON.parse(fs.readFileSync('geonames.json'))

let filteredByNation = new Map()
for (let place of placeNames) {
    if (!place.cou_name_en) {
        continue
    }
    let countryCode = place.country_code
    let placesForCountryCode = filteredByNation.get(countryCode);
    if (placesForCountryCode == null) {
        placesForCountryCode = []
        console.log(`${countryCode} : ${place.cou_name_en}`)
    }
    placesForCountryCode.push(place.ascii_name)
    filteredByNation.set(countryCode, placesForCountryCode)
}

fs.writeFileSync('filtered_geonames.json', JSON.stringify(Object.fromEntries(filteredByNation.entries()), null, 2))
console.log(JSON.stringify(Array.from(filteredByNation.keys())))
