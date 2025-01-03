import { DB } from "https://deno.land/x/sqlite/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

import { RowObject } from "https://deno.land/x/sqlite/mod.ts";

interface User extends RowObject {
  username: string;
  password: string;
}

export class AuthDatabase {
  private db: DB;

  constructor(dbPath: string) {
    this.db = new DB(dbPath);
    this.initializeDatabase();
  }

  private initializeDatabase() {
    this.db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async addUser(username: string, password: string): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password + salt);
    
    try {
      this.db.execute("BEGIN TRANSACTION");
      this.db.query(
        "INSERT INTO users (username, password_hash, salt) VALUES (?, ?, ?)",
        [username, passwordHash, salt]
      );
      this.db.execute("COMMIT");
    } catch (error) {
      this.db.execute("ROLLBACK");
      throw error;
    }
  }

  async validateUser(username: string, password: string): Promise<boolean> {
    const user = this.db.queryEntries<User & {salt: string}>(
      "SELECT username, password_hash as password, salt FROM users WHERE username = ?",
      [username]
    )[0];

    if (!user) return false;

    return await bcrypt.compare(password + user.salt, user.password);
  }

  closeDB() {
    this.db.close();
  }
}