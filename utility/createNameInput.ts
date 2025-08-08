import { readFile, writeFile } from "fs/promises"
import * as path from "path";
import { NameInput } from "src/nameOption/NameOption";
import { NameType } from "src/nameOption/NameType";

interface RawName {
    name: string
    lineage: string
    sex: string
    frequency: number
}

(async () => {
    let input = await readFile(path.join(__dirname, 'names.json'))
    let json = JSON.parse(input.toString());
    let allNames: Set<NameInput> = new Set();
    allNames.add(new NameInput("of", NameType.PARTICLE, "O"))
    for (let key of Object.entries(json)) {
        let names: RawName[] = json[key[0]];
        for (let name of names) {
            let nameInput = new NameInput(name.name, NameType.GIVEN, name.sex)
            allNames.add(nameInput)
        }
    }
    await writeFile('nameInputs.json', JSON.stringify(Array.from(allNames), undefined, 2))
})()