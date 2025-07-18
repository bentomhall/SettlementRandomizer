import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, ManyToOne} from 'typeorm'
import { CulturePersonNamePrevalence } from './CulturePersonNamePrevalence';

@Entity()
export class PersonNameEntry {
    @PrimaryGeneratedColumn()
    public id: number
    @Column("varchar", { nullable: false})
    public name: string ;

    @ManyToOne(() => CulturePersonNamePrevalence, (prev) => prev.person)
    public prevalences: CulturePersonNamePrevalence[]
}

