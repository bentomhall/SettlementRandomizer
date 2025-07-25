import { Module } from "@nestjs/common";
import { DatabaseProvider, DataFileProvider } from "./shared/dbProvider";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  providers: [DatabaseProvider, DataFileProvider],
  exports: [DatabaseProvider, DataFileProvider]
})
export class DbModule {}