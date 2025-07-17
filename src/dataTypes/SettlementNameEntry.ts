import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { CultureEntry } from "./CultureEntry";

@Entity()
export class SettlementNameEntry {
    @PrimaryGeneratedColumn()
    id: number = 0
    @Column("varchar", {nullable: false})
    name: string = ""

    @ManyToMany(() => CultureEntry)
    cultures: CultureEntry[] = []
}