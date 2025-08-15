import { Body, Controller, Delete, Get, Logger, Param, Post, Query } from "@nestjs/common";
import { NameOptions, NameService } from "./nameOption/NameService";
import { NameInput, NameOption, NameOutput } from "./nameOption/NameOption";

@Controller('names')
export class NameController {
    private logger = new Logger('NameController');
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
        let names = await this.service.getAllByType(type);
        this.logger.debug(`Got ${names.length} names`);
        return names.map(x => NameOutput.fromName(x));
    }

     @Post('bulk')
    async createBulk(@Body() body: NameInput[]): Promise<NameOutput[]> {
        let options = body.map(n => NameOption.fromValues(n.value, n.type, n.gender))
        return (await this.service.bulkInsert(options)).map(n => NameOutput.fromName(n));   
    }

    @Post()
    async create(@Body() body: NameInput): Promise<NameOutput> {
        let option = NameOption.fromValues(body.value, body.type, body.gender);
        return NameOutput.fromName(await this.service.insertOne(option));
    }

    @Delete(':id')
    async deleteById(@Param('id') id: number) {
        await this.service.deleteById(id);
    }
}