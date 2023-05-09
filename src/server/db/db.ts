import { Pool } from "pg";
import {
  Kysely,
  PostgresDialect,
  type Generated,
  type ColumnType,
  type Selectable,
  type Insertable,
  type Updateable,
} from "kysely";
import type { Database } from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var kysely: Kysely<Database>;
}

const connect = () => {
  if (!global.kysely) {
    global.kysely = new Kysely<Database>({
      dialect: new PostgresDialect({
        pool: new Pool({
          host: "localhost",
          port: 5432,
          database: "postgres",
          user: "postgres",
          password: "postgres",
        }),
      }),
    });
  }

  return global.kysely;
};

export const db = connect();
