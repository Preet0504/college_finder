import { db } from "./db";
import { universities, scholarships, users } from "../shared/schema";
import bcrypt from "bcrypt";

async function seed() {
  console.log("Seeding database...");

  // Seed Users
  const password = await bcrypt.hash("password123", 10);
  const sampleUsers = [
    { username: "john_doe", email: "john@example.com", password },
    { username: "jane_smith", email: "jane@example.com", password },
    { username: "alex_scholar", email: "alex@example.com", password },
    { username: "sam_university", email: "sam@example.com", password },
    { username: "edu_pro", email: "edu@example.com", password },
  ];

  for (const user of sampleUsers) {
    await db.insert(users).values(user).onConflictDoNothing();
  }

  // Seed Universities
  const sampleUniversities = [
    { name: "MIT", location: "Cambridge, MA", country: "USA", ranking: 1, acceptanceRate: 4.0, tuition: 58000, programs: ["CS", "Engineering"] },
    { name: "Stanford", location: "Stanford, CA", country: "USA", ranking: 2, acceptanceRate: 3.9, tuition: 60000, programs: ["AI", "Business"] },
    { name: "Oxford", location: "Oxford", country: "UK", ranking: 3, acceptanceRate: 15.0, tuition: 45000, programs: ["History", "Law"] },
    { name: "Harvard", location: "Cambridge, MA", country: "USA", ranking: 4, acceptanceRate: 3.2, tuition: 55000, programs: ["Medicine", "Law"] },
    { name: "ETH Zurich", location: "Zurich", country: "Switzerland", ranking: 5, acceptanceRate: 25.0, tuition: 2000, programs: ["Physics", "CS"] },
  ];

  for (const uni of sampleUniversities) {
    await db.insert(universities).values(uni);
  }

  // Seed Scholarships
  const sampleScholarships = [
    { name: "Rhodes Scholarship", amount: 50000, deadline: "2025-10-01", description: "Prestigious award for Oxford", eligibility: "Postgraduates", type: "Merit" },
    { name: "Fullbright Program", amount: 30000, deadline: "2025-09-15", description: "International exchange", eligibility: "Students/Scholars", type: "Cultural" },
    { name: "Gates Cambridge", amount: 45000, deadline: "2025-12-05", description: "For Cambridge University", eligibility: "Non-UK students", type: "Merit" },
  ];

  for (const schol of sampleScholarships) {
    await db.insert(scholarships).values(schol);
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);
