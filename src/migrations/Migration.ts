import { Pool, RowDataPacket } from "mysql2/promise"
import { BaseMigration } from "./1";
import { Logger } from "@nestjs/common";

export interface DataModelMigration {
  get sequence(): number
  get label(): string
  get path(): string

  up(conn: Pool): Promise<void>
  down(conn: Pool): Promise<void>
}

interface MigrationResult {
  sequence: number,
  label: string,
  applied: boolean
}

export class MigrationRunner {
  
  private migrations: Map<number, DataModelMigration> = new Map([
    [1, new BaseMigration()]
  ]);
  private logger: Logger = new Logger(MigrationRunner.name);
  constructor(private connection: Pool) {
  }

  /**
   * Attempts to apply the next migration in sequence. 
   * @param current The current migration sequence. If unset, fetches it from the database.
   * @returns true if a migration was applied.
   */
  private async applyNext(): Promise<MigrationResult> {
    let lastAppliedMigration = await this.getCurrentMigration();
    let nextSequence = lastAppliedMigration + 1;
    let nextMigration = this.migrations.get(nextSequence);
    if (!nextMigration) {
      let lastMigration = this.migrations.get(lastAppliedMigration);
      return {
        sequence: lastAppliedMigration,
        label: lastMigration?.label ?? "Unknown!",
        applied: false
      };
    }
    try {
      await nextMigration.up(this.connection);
      await this.addMigrationEntry(nextMigration);
    } catch (error) {
      this.logger.error(error, `Database error performing migration ${nextMigration.label}`);
      return {
        sequence: nextSequence,
        label: nextMigration.label,
        applied: false
      }
    }
    return {
      sequence: nextSequence,
      label: nextMigration.label,
      applied: true
    }
  }

  async synchronizeSchema(): Promise<void> {
    let result = await this.applyNext();
    if (!result.applied) {
      this.logger.debug({lastMigration: result.label})
      return;
    }
    await this.synchronizeSchema();
  }

  private async getCurrentMigration(): Promise<number> {
    const query = `SELECT MAX(id) as seq FROM migration;`
    let result = (await this.connection.query<RowDataPacket[]>(query))[0];
    if (result.length == 0) {
      return 0
    }
    return result[1].seq;
  }

  private async addMigrationEntry(m: DataModelMigration): Promise<void> {
    await this.connection.query(`CREATE TABLE IF NOT EXISTS migration (
        id INT PRIMARY KEY,
        label VARCHAR NOT NULL,
        applied TIMESTAMP DEFAULT NOW() 
      );`
    );
    await this.connection.query(`INSERT INTO migration (id, label) VALUES (?, ? ,?);`,
      [m.sequence, m.label]
    );
  }

  private async removeMigrationEntry(seq: number): Promise<void> {
    let last = await this.getCurrentMigration();
    if (last != seq) {
      throw new Error(`Cannot remove migrations out of sequence! ${last} != ${seq}`)
    };
    await this.connection.query(`DELETE FROM migration WHERE id = ?`, [seq]);
  }
}