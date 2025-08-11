import { readFile, writeFile } from "fs/promises"
import * as path from "path";
import { NameInput } from "../src/nameOption/NameOption";
import { NameType } from "../src/nameOption/NameType";

interface RawName {
    name: string
    lineage: string
    sex: string
    frequency: number
}

(async () => {
  let input = await readFile(path.join(__dirname, 'names.json'))
  let json: Record<string, RawName[]> = JSON.parse(input.toString());
  let allNames: Record<string, Record<string, number>> = {};
  for (let key of Object.entries(json)) {
    let subGroup: Record<string, number> = {}
    let names: RawName[] = json[key[0]];
    for (let name of names) {
        subGroup[name.name] = name.frequency
    }
    allNames[key[0]] = subGroup
  }
  await writeFile('nameInputs.json', JSON.stringify(allNames, undefined, 2))
})()