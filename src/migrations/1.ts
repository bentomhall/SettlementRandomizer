import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { DataModelMigration } from "./Migration";

export class BaseMigration implements DataModelMigration {
  get sequence(): number {
    return 1;
  }
  get label(): string {
    return 'Base schema';
  }
  get path(): string {
    return `src/migrations/1.ts`;
  }
  async up(conn: PoolConnection): Promise<void> {
    await this.createDatabase(conn);
    await this.createGenderTable(conn);
    await this.createLineageTables(conn);
    await this.createNameTables(conn);
    await this.createCultureTables(conn);
  }
  async down(conn: PoolConnection): Promise<void> {
    await conn.query(`DROP DATABASE settlement_randomizer;`);
  }

  private async createDatabase(conn: PoolConnection) {
    await conn.query<ResultSetHeader>(`CREATE DATABASE settlement_randomizer`);
  }

  private async createGenderTable(conn: PoolConnection) {
    await conn.query(`CREATE TABLE gender (
        id INT AUTO_INCREMENT PRIMARY KEY,
        key CHAR(1) NOT NULL UNIQUE,
        label VARCHAR(10) NOT NULL;
      );`
    );
    await conn.query(`INSERT INTO gender (key, label) VALUES (
        ('M', 'male'),
        ('F', 'female'),
        ('N', 'neuter'),
        ('O', 'other')
      );`
    );
  }

  private async createLineageTables(conn: PoolConnection) {
    await conn.query(`CREATE TABLE lineage (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL UNIQUE,
        adultAge INT NOT NULL,
        maxAge INT NOT NULL,
        elderlyAge INT NOT NULL
      );`
    );
    await conn.query(`CREATE TABLE lineage_gender_frequency (
        lineage_id INT NOT NULL,
        gender_id INT NOT NULL,
        frequency FLOAT NOT NULL DEFAULT 1.0,
        PRIMARY KEY (lineage_id, gender_id),
        FOREIGN KEY fk_lineage_lineage_gender (lineage_id) REFERENCES lineage(id) ON DELETE CASCADE,
        FOREIGN KEY fk_gender_lineage_gender (gender_id) REFERENCES gender(id)
      );`
    );
  }

  private async createNameTables(conn: PoolConnection) {
    await conn.query(`CREATE TABLE name_type (
        id INT AUTO_INCREMENT PRIMARY KEY,
        value VARCHAR(25) NOT NULL UNIQUE
      );`
    );
    await conn.query(`INSERT INTO name_type (value) VALUES (
        ('settlement'),
        ('given'),
        ('family'),
        ('particle')
      );`
    );
    await conn.query(`CREATE TABLE name_option (
        id INT AUTO_INCREMENT PRIMARY KEY,
        value VARCHAR(255) NOT NULL,
        type_id INT NOT NULL,
        FOREIGN KEY fk_name_type (type_id) REFERENCES name_type(id) 
      );`
    );
  }

  private async createCultureTables(conn: PoolConnection) {
    await conn.query(`CREATE TABLE culture (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        name_template VARCHAR(255) NOT NULL DEFAULT '{{given}} {{family}}'
      );`
    );
    await conn.query(`CREATE TABLE culture_lineage_frequency (
        culture_id INT NOT NULL,
        lineage_id INT NOT NULL,
        frequency FLOAT NOT NULL DEFAULT 1.0,
        PRIMARY KEY (culture_id, lineage_id),
        FOREIGN KEY fk_culture_culture_lineage (culture_id) REFERENCES culture(id) ON DELETE CASCADE,
        FOREIGN KEY fk_lineage_culture_lineage (lineage_id) REFERENCES lineage(id) ON DELETE CASCADE
      );`
    );
    await conn.query(`CREATE TABLE culture_name_frequency (
        culture_id INT NOT NULL,
        name_id INT NOT NULL,
        frequency FLOAT NOT NULL DEFAULT 1.0,
        PRIMARY KEY (culture_id, name_id),
        FOREIGN KEY fk_culture_culture_name (culture_id) REFERENCES culture(id) ON DELETE CASCADE,
        FOREIGN KEY fk_name_culture_name (name_id) REFERENCES name(id) ON DELETE CASCADE
      );`
    );
  }
}