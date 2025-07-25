import { Module } from '@nestjs/common';
import { LineageController } from './lineage.controller';
import { DbModule } from './db.module';
import { LineageRepository } from './lineage/LineageRepository';

@Module({
  imports: [],
  controllers: [LineageController],
  providers: [DbModule, LineageRepository],
})
export class AppModule {}
