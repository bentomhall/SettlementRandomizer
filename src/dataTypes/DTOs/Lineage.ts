import { nameToKey } from "../../utility/StringUtils";
import { LineageEntry } from "../LineageEntry";

export class Lineage {
  public static schema = {
    $id: 'Lineage',
    type: 'object',
    properties: {
      key: {
        type: 'string',
      },
      name: {
        type: 'string'
      },
      adultAge: {
        type: 'integer',
        minimum: 10,
        maximum: 30
      },
      maximumAge: {
        type: 'integer',
        minimum: 60
      }
    }
  }

  public constructor(public key: string, public name: string, public adultAge: number, public maximumAge: number) {}

  public static fromEntity(entity: LineageEntry): Lineage {
    return new Lineage(
      entity.name,
      nameToKey(entity.name),
      entity.adultAge,
      entity.maxAge
    )
  }
}