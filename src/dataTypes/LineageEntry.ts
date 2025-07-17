import { Column, Entity, ForeignKey, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { CultureEntry } from "./CultureEntry";

@Entity()
export class LineageEntry {
    @PrimaryGeneratedColumn()
    id: number = 0

    @Column({nullable: false, unique: true})
    name: string = ""

    @ManyToOne(() => CultureDemographics, (demo) => demo.lineage)
    public cultureDemographics: CultureDemographics
}

@Entity()
export class CultureDemographics {
    @PrimaryColumn()
    cultureId: number = 0
    @PrimaryColumn()
    lineageId: number = 0

    @Column()
    prevalence: number = 0

    @OneToMany(() => CultureEntry, (culture) => culture.cultureDemographics)
    public culture: CultureEntry

    @OneToMany(() => LineageEntry, (lineage) => lineage.cultureDemographics)
    public lineage: LineageEntry
}