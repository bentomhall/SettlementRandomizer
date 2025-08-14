import { Name } from "src/shared/Name";
import { NameType } from "./NameType";
import { InvalidOperationError, InvalidParameterError } from "src/shared/CustomErrors";
import { Gender } from "src/lineage/Gender";

export class NameOutput {
    constructor(public readonly id: number, public readonly value: string, public readonly type: string, public readonly gender: string | null) {}

    public static fromName(name: NameOption): NameOutput {
        return new NameOutput(name.id, name.value, name.type.value, name.gender?.key ?? null);
    }
}

export class NameInput {
    constructor(public readonly value: string, public readonly type: string, public readonly gender: string | null) {}
}

export class NameOption {
    #id: number = -1;
    #value: Name;
    #type: NameType;
    #gender: Gender | null

    constructor(value: Name, type: NameType, gender: Gender | null, id?: number) {
        if (id) {
            this.#id = id;
        }
        this.#type = type;
        this.#value = value;
        this.#gender = gender;
    }

    static fromValues(value: string, type: string, genderKey: string | null, id?: number): NameOption {
        let nameType = NameType.parse(type);
        if (!nameType) {
            throw new InvalidParameterError(`Unrecognized name type: ${type}`);
        }
        if (genderKey == null && !nameType.equals(NameType.SETTLEMENT)) {
            genderKey = "O"
        }
        let gender = nameType.equals(NameType.SETTLEMENT) ? null : Gender.fromKey(genderKey!);
        return new NameOption(new Name(value), nameType, gender, id)
    }

    public set id(value: number) {
        if (this.#id != -1) {
            throw new InvalidOperationError(`Cannot set id--it is already set!`);
        }
        this.#id = value;
    }

    public get id(): number {
        return this.#id;
    }

    public get value(): string {
        return this.#value.value;
    }

    public get type(): NameType {
        return this.#type;
    }

    public get gender(): Gender | null{
        return this.#gender;
    }

    public isType(type: string): boolean {
        return this.#type.equals(type)
    }
}