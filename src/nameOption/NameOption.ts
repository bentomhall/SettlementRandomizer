import { Name } from "src/shared/Name";
import { NameType } from "./NameType";
import { InvalidOperationError, InvalidParameterError } from "src/shared/CustomErrors";

export class NameOutput {
    constructor(public readonly id: number, public readonly value: string, public readonly type: string) {}

    public static fromName(name: NameOption): NameOutput {
        return new NameOutput(name.id, name.value, name.type.value);
    }
}

export class NameOption {
    #id: number = -1;
    #value: Name;
    #type: NameType;

    constructor(value: Name, type: NameType, id?: number) {
        if (id) {
            this.#id = id;
        }
        this.#type = type;
        this.#value = value;
    }

    static fromValues(type: string, value: string): NameOption {
        let nameType = NameType.parse(type);
        if (!nameType) {
            throw new InvalidParameterError(`Unrecognized name type: ${type}`);
        }
        return new NameOption(new Name(value), nameType)
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
}