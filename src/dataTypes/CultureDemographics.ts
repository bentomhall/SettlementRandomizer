import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm"
import { CultureEntry } from "./CultureEntry"
import { LineageEntry } from "./LineageEntry"

@Entity()
export class CultureDemographics {
    @PrimaryColumn()
    cultureId: number
    @PrimaryColumn()
    lineageId: number

    @Column()
    prevalence: number

    @OneToMany(() => CultureEntry, (culture) => culture.cultureDemographics)
    public culture: CultureEntry

    @OneToMany(() => LineageEntry, (lineage) => lineage.cultureDemographics)
    public lineage: LineageEntry
}