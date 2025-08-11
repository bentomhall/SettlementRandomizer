import { Lineage } from "src/lineage/Lineage"
import { NameOption } from "src/nameOption/NameOption"
import { NameType } from "src/nameOption/NameType"
import { weightedChoice, WeightedOption } from "src/shared/choice"
import { InvalidOperationError } from "src/shared/CustomErrors"

export class CultureDto {
    constructor(
        public name: string,
        public settlementNameFrequencies: string[],
        public personNameFrequencies: Record<string, number> | string[],
        public personNameTemplate: string,
        public demographics: Record<string, number>,
    ){}

    nameFrequencies(allNames: NameOption[]): {settlement: NameFrequency[], person: NameFrequency[]} {
        let settlement: NameFrequency[] = []
        let person: NameFrequency[] = []
        for (let name of allNames) {
            if (this.settlementNameFrequencies.includes(name.value)) {
                settlement.push(new NameFrequency(name, 1))
            } else if (Array.isArray(this.personNameFrequencies) && this.personNameFrequencies.includes(name.value)) {
                person.push(new NameFrequency(name, 1))
            } else if (this.personNameFrequencies[name.value] != undefined) {
                person.push(new NameFrequency(name, this.personNameFrequencies[name.value]!))
            }
        }
        return {settlement, person}
    }

    demographicFrequencies(allLineages: Lineage[]): WeightedOption<Lineage>[] {
        let output: LineageFrequency[] = [];
        for (let lineage of allLineages) {
            if (this.demographics[lineage.name.value]) {
                output.push(new LineageFrequency(lineage, this.demographics[lineage.name.value]))
            }
        }
        return output;
    }
}

export class LineageFrequency implements WeightedOption<Lineage> {
    #lineage: Lineage
    #frequency: number

    constructor(lineage: Lineage, frequency: number) {
        this.#frequency = frequency;
        this.#lineage = lineage
    }

    get value(): Lineage {
        return this.#lineage
    }
    get frequency(): number {
        return this.#frequency
    }
    rescale(total: number): void {
        this.#frequency /= total
    }
}

export class NameFrequency implements WeightedOption<NameOption>{
    #name: NameOption
    #frequency: number
    
    constructor(nameOption: NameOption, frequency: number) {
        this.#frequency = frequency
        this.#name = nameOption
    }

    get value(): NameOption {
        return this.#name
    }
    get frequency(): number {
        return this.#frequency
    }
    rescale(total: number): void {
        this.#frequency /= total;
    }
}

export class Culture {
    #id: number = -1
    #name: string
    #settlementNames: WeightedOption<NameOption>[]
    #personNames: WeightedOption<NameOption>[]
    #personNameTemplate: string
    #demographics: WeightedOption<Lineage>[]

    constructor(name: string, nameTemplate: string, names: {settlement: WeightedOption<NameOption>[], person: WeightedOption<NameOption>[]}, demographicFrequencies: WeightedOption<Lineage>[], id?: number) {
        this.#id = id ?? -1
        this.#name = name
        this.#personNameTemplate = nameTemplate
        this.#personNames = names.person
        this.#settlementNames = names.settlement
        this.#demographics = demographicFrequencies
    }

    static fromDto(dto: CultureDto, allLineages: Lineage[], allNames: NameOption[]): Culture {
        let names = dto.nameFrequencies(allNames)
        let demographics = dto.demographicFrequencies(allLineages)
        return new Culture(dto.name, dto.personNameTemplate, names, demographics);
    }

    set id(value: number) {
        if (this.#id != -1) {
            throw new InvalidOperationError(`Cannot set id to ${value}, it is already set to ${this.#id}`)
        }
    }
    get id(): number {
        return this.#id;
    }
    get name(): string {
        return this.#name;
    }
    get nameTemplate(): string {
        return this.#personNameTemplate;
    }
    get demographics(): WeightedOption<Lineage>[] {
        return this.#demographics;
    }
    get settlementNames(): WeightedOption<NameOption>[] {
        return this.#settlementNames;
    }
    get personNames(): WeightedOption<NameOption>[] {
        return this.#personNames;
    }

    getRandomSettlementName(): NameOption {
        return weightedChoice(this.#settlementNames)
    }

    getRandomPersonName(): string {
        let givenName = weightedChoice(this.#personNames.filter(n => n.value.type.value == NameType.GIVEN)).value
        let familyName = weightedChoice(this.#personNames.filter(n => n.value.type.value == NameType.FAMILY)).value
        let particle = '';
        if (this.#personNameTemplate.includes('{{particle}}')) {
            particle = weightedChoice(this.#personNames.filter(n => n.value.type.value == NameType.PARTICLE)).value
        }
        return this.#personNameTemplate.replace('{{given}}', givenName).replace('{{family}}', familyName).replaceAll('{{particle}}', particle)
    }
    getRandomLineage(): Lineage {
        return weightedChoice(this.#demographics);
    }
}