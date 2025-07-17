import { DataSource } from "typeorm";

export class PersonController {
  constructor(private dataSource: DataSource) { }
}