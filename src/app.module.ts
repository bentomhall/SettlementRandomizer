import { Module } from '@nestjs/common';
import { LineageController } from './lineage.controller';
import { DbModule } from './db.module';
import { LineageRepository } from './lineage/LineageRepository';
import { ConfigModule } from '@nestjs/config';
import { LineageService } from './lineage/LineageService';
import { MigrationRunner } from './migrations/Migration';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [LineageController],
  providers: [DbModule, LineageRepository, LineageService, MigrationRunner],
})
export class AppModule {}
