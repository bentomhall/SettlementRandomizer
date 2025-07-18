export enum Gender {
    Male = "M",
    Female = "F",
    Other = "Other"
}


export class Person {
    constructor(public name: string, public lineage: string, public age: number, public occupation: string, public quirk: string, public gender: Gender) {}
}