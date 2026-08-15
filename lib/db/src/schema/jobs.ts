import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  doublePrecision,
} from "drizzle-orm/pg-core";
import { communitiesTable } from "./geo";
import { serviceCategoriesTable } from "./categories";
import { providersTable } from "./providers";

export const jobsTable = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => serviceCategoriesTable.id),
  communityId: integer("community_id")
    .notNull()
    .references(() => communitiesTable.id),
  budgetType: text("budget_type").notNull(), // fixed | range | open
  budgetMin: doublePrecision("budget_min"),
  budgetMax: doublePrecision("budget_max"),
  urgency: text("urgency").notNull().default("flexible"),
  preferredDate: text("preferred_date"),
  status: text("status").notNull().default("open"),
  isMine: boolean("is_mine").notNull().default(false),
  selectedInterestId: integer("selected_interest_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const jobInterestsTable = pgTable("job_interests", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id")
    .notNull()
    .references(() => jobsTable.id),
  providerId: integer("provider_id")
    .notNull()
    .references(() => providersTable.id),
  message: text("message").notNull(),
  canMeetBudget: boolean("can_meet_budget").notNull().default(true),
  estimateMin: doublePrecision("estimate_min"),
  estimateMax: doublePrecision("estimate_max"),
  availability: text("availability"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Job = typeof jobsTable.$inferSelect;
export type JobInterest = typeof jobInterestsTable.$inferSelect;
