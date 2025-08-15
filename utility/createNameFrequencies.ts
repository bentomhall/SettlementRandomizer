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
  let input = await readFile(path.join(__dirname, 'names_by_culture.json'))
  let json: Record<string, string[]> = JSON.parse(input.toString());
  let allNames: NameInput[] = []
  for (let key of Object.entries(json)) {
    let names: string[] = json[key[0]];
    for (let name of names) {
      allNames.push(new NameInput(name, 'settlement', null))
    }
  }
  await writeFile('city_names.json', JSON.stringify(allNames, undefined, 2))
})()