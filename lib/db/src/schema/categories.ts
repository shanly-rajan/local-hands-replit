import { pgTable, text, serial } from "drizzle-orm/pg-core";

export const serviceCategoriesTable = pgTable("service_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  groupName: text("group_name").notNull(),
  icon: text("icon").notNull(),
});

export type ServiceCategory = typeof serviceCategoriesTable.$inferSelect;
