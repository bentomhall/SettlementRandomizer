import { Name } from "./Name";

export function keyFromName(name: Name): string {
  return name.valueOf().toLowerCase().replaceAll(/[ ']/, '-')
}