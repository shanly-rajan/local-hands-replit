import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { countriesTable } from "./geo";

export const adsTable = pgTable("advertisements", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  countryId: integer("country_id")
    .notNull()
    .references(() => countriesTable.id),
  targetArea: text("target_area").notNull(),
  imageUrl: text("image_url").notNull(),
  linkUrl: text("link_url"),
  active: boolean("active").notNull().default(true),
});

export type Advertisement = typeof adsTable.$inferSelect;
