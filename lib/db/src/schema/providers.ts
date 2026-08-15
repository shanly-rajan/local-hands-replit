import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { communitiesTable } from "./geo";
import { serviceCategoriesTable } from "./categories";

export const providersTable = pgTable("providers", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  providerType: text("provider_type").notNull(), // individual | sole_trader | small_business | company
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  communityId: integer("community_id")
    .notNull()
    .references(() => communitiesTable.id),
  verificationStatus: text("verification_status").notNull().default("not_verified"),
  priceIndicator: text("price_indicator"),
  yearsActive: integer("years_active"),
  serviceAreas: text("service_areas").array().notNull().default([]),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const providerCategoriesTable = pgTable("provider_categories", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id")
    .notNull()
    .references(() => providersTable.id),
  categoryId: integer("category_id")
    .notNull()
    .references(() => serviceCategoriesTable.id),
});

export const reviewsTable = pgTable("reviews", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id")
    .notNull()
    .references(() => providersTable.id),
  reviewerName: text("reviewer_name").notNull(),
  comment: text("comment").notNull(),
  verifiedJob: boolean("verified_job").notNull().default(false),
  quality: integer("quality").notNull(),
  price: integer("price").notNull(),
  reliability: integer("reliability").notNull(),
  professionalism: integer("professionalism").notNull(),
  overall: integer("overall").notNull(),
  providerResponse: text("provider_response"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const favoritesTable = pgTable("favorites", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id")
    .notNull()
    .references(() => providersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Provider = typeof providersTable.$inferSelect;
export type Review = typeof reviewsTable.$inferSelect;
