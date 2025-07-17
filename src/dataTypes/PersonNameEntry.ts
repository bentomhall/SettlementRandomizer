import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, ManyToOne} from 'typeorm'
import { CultureEntry } from './CultureEntry';

@Entity()
export class PersonNameEntry {
    @PrimaryGeneratedColumn()
    public id: number = 0
    @Column("varchar", { nullable: false})
    public name: string = "";

    @ManyToOne(() => CulturePersonNamePrevalence, (prev) => prev.person)
    public prevalences: CulturePersonNamePrevalence[]
}

@Entity()
export class CulturePersonNamePrevalence {
    @PrimaryGeneratedColumn()
    public id: number = 0
    @Column()
    public personNameEntryId: number
    @Column()
    public cultureEntryId: number
    @Column("float", {nullable: false})
    public prevalence: number = 0.0;

    @OneToMany(() => PersonNameEntry, (person) => person.prevalences)
    public person: PersonNameEntry

    @OneToMany(() => CultureEntry, (culture) => culture.prevalences)
    public culture: CultureEntry
}