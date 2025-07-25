import { Controller, Get, Param, Query } from "@nestjs/common";
import { NameOptions, NameService } from "./nameOption/NameService";
import { NameOutput } from "./nameOption/NameOption";

@Controller('names')
export class NameController {
    constructor(private service: NameService) {}

    @Get(':id')
    async findOneById(@Param('id') id: number): Promise<NameOutput> {
        return NameOutput.fromName(await this.service.getOneById(id));
    }

    @Get()
    async findByType(@Query('type') type: NameOptions| undefined): Promise<NameOutput[]> {
        if (!type) {
            type = 'ALL';
        }
        return (await this.service.getAllByType(type)).map(x => NameOutput.fromName(x));
    }
}