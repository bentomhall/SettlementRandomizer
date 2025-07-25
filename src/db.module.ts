import { Module } from "@nestjs/common";
import { dbProvider } from "./shared/dbProvider";

@Module({
  providers: [dbProvider],
  exports: [dbProvider]
})
export class DbModule {}