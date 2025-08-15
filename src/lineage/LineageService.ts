import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { createLineageInput, Lineage, LineageDto } from "./Lineage";
import { LineageRepository } from "./LineageRepository";

export interface ReadOnlyLineageService {
    findAll(): Promise<Lineage[]>
    findById(id: number): Promise<Lineage>
}

@Injectable()
export class LineageService implements ReadOnlyLineageService {
    constructor(private repo: LineageRepository){}
    private logger = new Logger('LineageService');
    async findAll(): Promise<Lineage[]> {
        return await this.repo.getAll()
    }

    async findById(id: number): Promise<Lineage> {
        let lineage = await this.repo.getOneById(id);
        if (!lineage) {
            throw new NotFoundException()
        }
        return lineage;
    }

    async replace(dto: LineageDto, id: number): Promise<Lineage> {
        await this.findById(id);
        await this.repo.deleteById(id);
        return await this.create(dto);
    }

    async create(dto: LineageDto): Promise<Lineage> {
        let lineage = new Lineage(createLineageInput(dto));
        return await this.repo.upsert(lineage);
    }

    async deleteById(id: number): Promise<void> {
        return await this.repo.deleteById(id);
    }
}