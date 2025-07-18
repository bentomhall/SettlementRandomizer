import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CultureDemographics } from "./CultureDemographics";

@Entity()
export class LineageEntry {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false, unique: true})
    name: string

    @Column("int", {nullable: false})
    adultAge: number

    @Column("int", {nullable: false})
    maxAge: number

    @ManyToOne(() => CultureDemographics, (demo) => demo.lineage)
    public cultureDemographics: CultureDemographics

    generateAge(occupation: string): number {
        if (occupation == "child") {
            return Math.floor(Math.random()*this.adultAge)
        }
        return Math.floor(Math.random()*(this.maxAge - this.adultAge + 1)) + this.adultAge;
    }
}

