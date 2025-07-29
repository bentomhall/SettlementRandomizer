import { Module } from '@nestjs/common';
import { LineageController } from './lineage.controller';
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
import { AuthGuard } from './admin/AuthGuard';
import { DatabaseProvider, DataFileProvider } from './shared/dbProvider';
import { AdminController } from './admin.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [LineageController, NameController, CultureController, AdminController],
  providers: [
    DatabaseProvider, 
    DataFileProvider, 
    LineageRepository, 
    LineageService, 
    MigrationRunner, 
    NameRepository, 
    NameService, 
    CultureService, 
    CultureRepository,
    AuthGuard
  ],
})
export class AppModule {}
