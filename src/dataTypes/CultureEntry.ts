import { Entity, JoinTable, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn, Column, Unique, ManyToOne } from "typeorm";
import { CulturePersonNamePrevalence, PersonNameEntry } from "./PersonNameEntry";
import { SettlementNameEntry } from "./SettlementNameEntry";
import { CultureDemographics } from "./LineageEntry";

@Entity()
export class CultureEntry {
    @PrimaryGeneratedColumn()
    public id: number = 0
    @Column({unique: true, nullable: false})
    public key: string = ""

    @ManyToOne(() => CulturePersonNamePrevalence, (prev) => prev.culture)
    public prevalences: CulturePersonNamePrevalence[]

    @ManyToMany(() => SettlementNameEntry)
    @JoinTable()
    public settlementNameEntries: SettlementNameEntry[]

    @ManyToOne(() => CultureDemographics, (demo) => demo.culture)
    public cultureDemographics: CultureDemographics
}