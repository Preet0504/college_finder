import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  areaOfInterest: text("area_of_interest"),
  cgpa: doublePrecision("cgpa"),
  cgpaScale: doublePrecision("cgpa_scale"),
  budget: integer("budget"),
  intake: text("intake"),
  country: text("country"),
  ieltsScore: text("ielts_score"),
  toeflScore: text("toefl_score"),
  greScore: text("gre_score"),
  gmatScore: text("gmat_score"),
  satScore: text("sat_score"),
});

export const universities = pgTable("universities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  country: text("country").notNull(),
  ranking: integer("ranking"),
  acceptanceRate: doublePrecision("acceptance_rate"),
  tuition: integer("tuition"),
  students: integer("students"),
  avgSalary: integer("avg_salary"),
  programs: text("programs").array(),
  gpaRequirement: doublePrecision("gpa_requirement"),
  applicationDeadline: text("application_deadline"),
  website: text("website"),
  description: text("description"),
});

export const scholarships = pgTable("scholarships", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  amount: integer("amount"),
  deadline: text("deadline"),
  description: text("description"),
  eligibility: text("eligibility"),
  provider: text("provider"),
  url: text("url"),
  type: text("type"),
});

export const insertUserSchema = createInsertSchema(users);
export const insertUniversitySchema = createInsertSchema(universities);
export const insertScholarshipSchema = createInsertSchema(scholarships);

export const essays = pgTable("essays", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  status: text("status").notNull().default("draft"),
  wordCount: integer("word_count").notNull().default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  universityName: text("university_name").notNull(),
  status: text("status").notNull().default("planned"), // planned, in_progress, submitted, accepted, rejected
  deadline: text("deadline"),
  priority: text("priority").notNull().default("medium"),
});

export const insertEssaySchema = createInsertSchema(essays);
export const insertApplicationSchema = createInsertSchema(applications);

export type Essay = typeof essays.$inferSelect;
export type Application = typeof applications.$inferSelect;
