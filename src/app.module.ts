import { Module } from '@nestjs/common';
import { LineageController } from './lineage.controller';
import { DbModule } from './db.module';
import { LineageRepository } from './lineage/LineageRepository';
import { ConfigModule } from '@nestjs/config';
import { LineageService } from './lineage/LineageService';
import { MigrationRunner } from './migrations/Migration';
import { NameController } from './name.controller';
import { NameRepository } from './nameOption/NameRepository';
import { NameService } from './nameOption/NameService';
import { CultureService } from './culture/CultureService';
import { CultureRepository } from './culture/CultureRepository';
import { CultureController } from './culture.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [LineageController, NameController, CultureController],
  providers: [DbModule, LineageRepository, LineageService, MigrationRunner, NameRepository, NameService, CultureService, CultureRepository],
})
export class AppModule {}
