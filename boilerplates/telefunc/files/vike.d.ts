import { D1Database } from "@cloudflare/workers-types";
import { dbD1, dbSqlite } from "@batijs/drizzle/database/drizzle/db";
import { db as sqliteDb } from "@batijs/sqlite/database/sqlite/db";

//# BATI.hasD1
declare module "telefunc" {
  namespace Telefunc {
    interface Context {
      env: {
        DB: D1Database;
      };
    }
  }
}

//# (!BATI.hasD1 && BATI.has("sqlite")) || BATI.has("drizzle")
declare module "telefunc" {
  namespace Telefunc {
    interface Context {
      db: BATI.If<{
        'BATI.has("sqlite") && !BATI.hasD1': ReturnType<typeof sqliteDb>;
        'BATI.has("drizzle") && !BATI.hasD1': ReturnType<typeof dbSqlite>;
        'BATI.has("drizzle")': ReturnType<typeof dbD1>;
        _: object;
      }>;
    }
  }
}

export {};
