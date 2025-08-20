export class Gender {
  public constructor(public id: number, public key: string, public value: string) {}

  public static maleKey = 'M';
  public static femaleKey = 'F';
  public static neuterKey = 'N';
  public static otherKey = 'O';

  public static get male(): Gender {
    return new Gender(1, this.maleKey, 'male');
  }

  public static get female(): Gender {
    return new Gender(2, this.femaleKey, 'female');
  }

  public static get neuter(): Gender {
    return new Gender(3, this.neuterKey, 'neuter');
  }

  public static get other(): Gender {
    return new Gender(4, this.otherKey, 'other');
  }

  public static fromKey(key: string): Gender {
    switch(key) {
      case Gender.maleKey:
        return Gender.male
      case Gender.femaleKey:
        return Gender.female
      case Gender.neuterKey:
        return Gender.neuter
      default:
        return Gender.other
    }
  }

  public equals(other: Gender | null, strict: boolean = false): boolean {
    if (other == null) { return false; }
    return strict ? other.id == this.id : other.id == this.id || other.key == Gender.otherKey;
  }
}