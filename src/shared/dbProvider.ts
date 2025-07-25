import { createPool } from "mysql2/promise"

export const dbProvider = {
  provide: 'POOL',
  useFactory: async () => {
    let database = 'settlement_randomizer';
    let username = 'api';
    let password = process.env.DB_PASSWORD
    if (!password) {
      throw new Error('No database password set in DB_PASSWORD')
    }
    return createPool({
      host: 'db',
      user: username,
      password: password,
      database: database
    });
  }
}