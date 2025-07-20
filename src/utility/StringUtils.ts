export function nameToKey(name: string): string {
  return name.toLowerCase().replace(' ', '-')
}