export class NameType {
    public static SETTLEMENT = 'settlement';
    public static GIVEN = 'given';
    public static FAMILY = 'family';
    public static PARTICLE = 'particle'

    constructor(public readonly id: number, public readonly value: string) {}

    public static get settlement() {
        return new NameType(1, this.SETTLEMENT);
    }

    public static get given() {
        return new NameType(2, this.GIVEN);
    }

    public static get family() {
        return new NameType(3, this.FAMILY);
    }

    public static get particle() {
        return new NameType(4, this.PARTICLE);
    }

    public static parse(s: string) : NameType | null {
        switch (s) {
            case this.SETTLEMENT:
                return this.settlement;
            case this.GIVEN:
                return this.given;
            case this.FAMILY:
                return this.family;
            case this.PARTICLE:
                return this.particle;
            default:
                return null;
        }
    }
}