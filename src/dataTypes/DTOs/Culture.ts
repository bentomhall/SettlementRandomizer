import { CultureEntry } from "../CultureEntry"

export interface Prevalence {
  id: number,
  prevalence: number
}

export class Culture {
  public static schema = {
    "$id": "CultureDto",
    properties: {
      name: {
        type: "string"
      },
      key: {
        type: "string"
      },
      demographics: {
        type: "object",
        properties: {
          lineageId: {
            type: "string"
          },
          prevalence: {
            type: "number"
          }
        }
      },
      peopleNames: {
        type: "array",
        items: {
          type: "object",
          properties: {
            nameId: "number",
            prevalence: "number"
          }
        }
      },
      settlementNames: {
        type: "array",
        items: {
          type: "number"
        }
      }
    }
  }

  public constructor(public key: string, public name: string, public peopleNames: Prevalence[], public settlementNames: number[], public demographics: Prevalence[]) {}

  public static fromCultureEntry(c: CultureEntry): Culture {
    return new Culture(
      c.key, c.name,
      c.prevalences.map(x => { return {id: x.personNameEntryId, prevalence: x.prevalence}}),
      c.settlementNameEntries.map(x => x.id),
      c.cultureDemographics.map(x => {return {id: x.lineageId, prevalence: x.prevalence}})
    )
  }
}