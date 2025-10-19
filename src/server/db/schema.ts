// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `valo-armory_${name}`);

export const weaponSkins = createTable(
  "weapon_skins",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    filename: d.varchar({ length: 256 }).notNull(),
    description: d.varchar({ length: 256 }),
    imageUrl: d.varchar({ length: 512 }).notNull(),
    userId: d.varchar({ length: 256 }).notNull(),
    weaponType: d.varchar({ length: 256 }).notNull(), // new column for weapon type
    weaponName: d.varchar({ length: 256 }).notNull(), // <-- Added column for weapon name
    apiKey: d.varchar({ length: 256 }).notNull(),
    status: d.varchar({ length: 50 }).default("Active").notNull(),
    price: d.integer().default(0).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  // (t) => [index("name_idx").on(t.name)],
);

export const weapons = createTable(
  "weapons",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }).notNull(), // e.g. Vandal
    type: d.varchar({ length: 256 }).notNull(), // e.g. Rifle, Sniper, Pistol
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  // (t) => [index("name_idx").on(t.name)],
);
