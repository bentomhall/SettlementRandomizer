import { Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "./admin/AuthGuard";
import { MigrationRunner } from "./migrations/Migration";

@Controller('admin')
export class AdminController{
    constructor() {}

    @Post('sync-schema')
    @UseGuards(AuthGuard)
    async synchSchema(runner: MigrationRunner) {
        await runner.synchronizeSchema()
    }
}