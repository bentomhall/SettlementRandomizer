import { Gender } from "src/lineage/Gender"
import { Lineage } from "src/lineage/Lineage"
import { NameOption } from "src/nameOption/NameOption"
import { NameType } from "src/nameOption/NameType"
import { weightedChoice, WeightedOption } from "src/shared/choice"
import { InvalidOperationError, InvalidParameterError } from "src/shared/CustomErrors"

export class CultureDto {
    constructor(
        public name: string,
        public settlementNameFrequencies: string[],
        public personNameFrequencies: Record<string, number> | string[],
        public personNameTemplate: string,
        public demographics: Record<string, number>,
    ){}
}

function nameFrequencies(dto: CultureDto, allNames: NameOption[]): {settlement: NameFrequency[], person: NameFrequency[]} {
    let settlement: NameFrequency[] = []
    let person: NameFrequency[] = []
    for (let name of allNames) {
        if (dto.settlementNameFrequencies.includes(name.value)) {
            settlement.push(new NameFrequency(name, 1))
        } else if (Array.isArray(dto.personNameFrequencies) && dto.personNameFrequencies.includes(name.value)) {
            person.push(new NameFrequency(name, 1))
        } else if (dto.personNameFrequencies[name.value] != undefined) {
            person.push(new NameFrequency(name, dto.personNameFrequencies[name.value]!))
        }
    }
    return {settlement, person}
}

function demographicFrequencies(dto: CultureDto, allLineages: Lineage[]) : WeightedOption<Lineage>[] {
    let output: LineageFrequency[] = [];
    for (let lineage of allLineages) {
        if (dto.demographics[lineage.name.value]) {
            output.push(new LineageFrequency(lineage, dto.demographics[lineage.name.value]))
        }
    }
    return output;
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
        let names = nameFrequencies(dto, allNames)
        if (names.person.filter(x => x.value.isType(NameType.GIVEN)).length == 0) {
            throw new InvalidParameterError(`Must give at least one given name`);
        }
        if (names.settlement.length == 0) {
            throw new InvalidParameterError(`Must give at least one settlement name`);
        }
        let demographics = demographicFrequencies(dto, allLineages)
        if (demographics.length == 0) {
            throw new InvalidParameterError(`Cultures must have at least one lineage`);
        }
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
        return weightedChoice(this.#settlementNames)!
    }

    getRandomPersonName(gender: Gender): string {
        let givenName = weightedChoice(this.#personNames.filter(n => n.value.type.value == NameType.GIVEN && gender.equals(n.value.gender)))!.value
        let familyName = weightedChoice(this.#personNames.filter(n => n.value.type.value == NameType.FAMILY))?.value
        let particle = '';
        if (this.#personNameTemplate.includes('{{particle}}')) {
            particle = weightedChoice(this.#personNames.filter(n => n.value.type.value == NameType.PARTICLE && gender.equals(n.value.gender)))?.value ?? ''
        }
        let name = this.#personNameTemplate.replace('{{given}}', givenName);
        if (familyName) {
            name = name.replace('{{family}}', familyName)
        }
        if (particle) {
            name = name.replaceAll('{{particle}}', particle)
        }
        return name;
    }
    getRandomLineage(): Lineage {
        return weightedChoice(this.#demographics)!;
    }
}