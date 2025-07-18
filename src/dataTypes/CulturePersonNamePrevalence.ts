import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, ManyToOne} from 'typeorm'
import { CultureEntry } from './CultureEntry';
import { PersonNameEntry } from './PersonNameEntry';

@Entity()
export class CulturePersonNamePrevalence {
    @PrimaryGeneratedColumn()
    public id: number
    @Column()
    public personNameEntryId: number
    @Column()
    public cultureEntryId: number
    @Column("float", {nullable: false})
    public prevalence: number;

    @OneToMany(() => PersonNameEntry, (person) => person.prevalences)
    public person: PersonNameEntry

    @OneToMany(() => CultureEntry, (culture) => culture.prevalences)
    public culture: CultureEntry
}