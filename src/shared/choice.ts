export interface WeightedOption<T> {
  get value(): T
  get frequency(): number
  rescale(total: number): void
}

export function weightedChoice<T>(options: WeightedOption<T>[]): T {
  let i: number;
  let weights = options.map(x => x.frequency)
  for (i = 1; i < weights.length; i++) {
    weights[i] += weights[i - 1];
  }
  let random = Math.random() * weights[weights.length - 1];
  for (i = 0; i < weights.length; i++) {
    if (weights[i] > random) {
      break;
    }
  }
  return options[i].value
}

export function choice<T>(items: T[]): T {
  return items[Math.floor(Math.random() * (items.length - 1))];
}

export function rescaleFrequencies<T extends WeightedOption<any>>(items: T[]): T[] {
  let total = items.map(x => x.frequency).reduce((p, c) => p+c);
  for (let item of items) {
    item.rescale(total)
  }
  return items;
}