import { Database as Driver } from "sqlite3";
import { open, Database } from "sqlite";
export const dbFileName = "users.db";
export class DB {
  public static async createDBConnection(): Promise<Database> {
    const db = await open({
      filename: `../${dbFileName}`,
      driver: Driver,
    });
    await DB.ensureTablesCreated(db);
    return db;
  }
  private static async ensureTablesCreated(
    connection: Database
  ): Promise<void> {
    await connection.run(
      `CREATE TABLE IF NOT EXISTS USERS (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  password TEXT,
  display_name TEXT,
  photo_url TEXT
) STRICT;`
    );
  }
}
