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
}