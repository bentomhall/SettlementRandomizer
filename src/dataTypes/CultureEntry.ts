import { Entity, JoinTable, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn, Column, Unique, ManyToOne } from "typeorm";
import { SettlementNameEntry } from "./SettlementNameEntry";
import { CultureDemographics } from "./CultureDemographics";
import { CulturePersonNamePrevalence } from "./CulturePersonNamePrevalence";
import { PersonNameEntry } from "./PersonNameEntry";
import { LineageEntry } from "./LineageEntry";

@Entity()
export class CultureEntry {
    @PrimaryGeneratedColumn()
    public id: number
    @Column({unique: true, nullable: false})
    public key: string
    @Column({nullable: false})
    public name: string

    @ManyToOne(() => CulturePersonNamePrevalence, (prev) => prev.culture)
    public prevalences: CulturePersonNamePrevalence[]

    @ManyToMany(() => SettlementNameEntry)
    @JoinTable()
    public settlementNameEntries: SettlementNameEntry[]

    @ManyToOne(() => CultureDemographics, (demo) => demo.culture)
    public cultureDemographics: CultureDemographics[]

    generateName(): PersonNameEntry {
        let weights = this.prevalences.map(x => x.prevalence)
        let item = weightedChoice<CulturePersonNamePrevalence>(this.prevalences, weights)
        return item.person;
    }

    generateLineage(): LineageEntry {
        let item = weightedChoice<CultureDemographics>(this.cultureDemographics, this.cultureDemographics.map(x => x.prevalence))
        return item.lineage;
    }
}