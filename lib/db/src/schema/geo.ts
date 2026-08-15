import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";

export const countriesTable = pgTable("countries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  currencyCode: text("currency_code").notNull(),
  currencySymbol: text("currency_symbol").notNull(),
  flagEmoji: text("flag_emoji").notNull(),
});

export const citiesTable = pgTable("cities", {
  id: serial("id").primaryKey(),
  countryId: integer("country_id")
    .notNull()
    .references(() => countriesTable.id),
  name: text("name").notNull(),
  region: text("region").notNull(),
});

export const communitiesTable = pgTable("communities", {
  id: serial("id").primaryKey(),
  cityId: integer("city_id")
    .notNull()
    .references(() => citiesTable.id),
  name: text("name").notNull(),
});

export type Country = typeof countriesTable.$inferSelect;
export type City = typeof citiesTable.$inferSelect;
export type Community = typeof communitiesTable.$inferSelect;
