"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
const NameOption_1 = require("../src/nameOption/NameOption");
const NameType_1 = require("../src/nameOption/NameType");
(async () => {
    let input = await (0, promises_1.readFile)('names.json');
    let json = JSON.parse(input.toString());
    let allNames = new Set();
    allNames.add(new NameOption_1.NameInput("of", NameType_1.NameType.PARTICLE, "O"));
    for (let key of json.keys()) {
        let names = json[key];
        for (let name of names) {
            let nameInput = new NameOption_1.NameInput(name.name, NameType_1.NameType.GIVEN, name.sex);
            allNames.add(nameInput);
        }
    }
    console.log(allNames);
})();
//# sourceMappingURL=createNameInput.js.map