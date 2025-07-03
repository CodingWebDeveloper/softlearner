#!/usr/bin/env node

/**
 * Database Setup Script for SoftLearner
 *
 * This script helps you set up the Supabase database for the SoftLearner project.
 * Run this script after creating your Supabase project.
 */

import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log("🚀 SoftLearner Database Setup\n");
  console.log("This script will help you set up your Supabase database.\n");

  // Check if database-setup.sql exists
  const sqlFile = path.join(__dirname, "..", "database-setup.sql");
  if (!fs.existsSync(sqlFile)) {
    console.error("❌ database-setup.sql not found!");
    console.log("Please ensure the file exists in the project root.");
    process.exit(1);
  }

  console.log("✅ Found database-setup.sql");

  // Read the SQL file
  const sqlContent = fs.readFileSync(sqlFile, "utf8");
  console.log(`📄 SQL file contains ${sqlContent.split("\n").length} lines\n`);

  console.log("📋 Setup Steps:\n");
  console.log("1. Create a Supabase project at https://supabase.com");
  console.log("2. Get your project URL and anon key");
  console.log("3. Add environment variables to .env.local");
  console.log("4. Run the SQL script in Supabase SQL Editor");
  console.log("5. Create storage buckets\n");

  const proceed = await question(
    "Do you want to proceed with the setup? (y/N): "
  );

  if (proceed.toLowerCase() !== "y" && proceed.toLowerCase() !== "yes") {
    console.log("Setup cancelled.");
    rl.close();
    return;
  }

  console.log("\n🔧 Step 1: Supabase Project Setup");
  console.log("1. Go to https://supabase.com");
  console.log("2. Create a new project");
  console.log("3. Wait for the project to be ready\n");

  const projectUrl = await question("Enter your Supabase project URL: ");
  const anonKey = await question("Enter your Supabase anon key: ");

  // Validate inputs
  if (!projectUrl.includes("supabase.co") || !anonKey.startsWith("eyJ")) {
    console.log("❌ Invalid Supabase URL or anon key format");
    rl.close();
    return;
  }

  console.log("\n🔧 Step 2: Environment Variables");
  console.log("Create or update your .env.local file with:");
  console.log("```");
  console.log(`NEXT_PUBLIC_SUPABASE_URL=${projectUrl}`);
  console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}`);
  console.log("```\n");

  const envFile = path.join(__dirname, "..", ".env.local");
  const envContent = `NEXT_PUBLIC_SUPABASE_URL=${projectUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}
`;

  const createEnv = await question(
    "Do you want to create/update .env.local? (y/N): "
  );

  if (createEnv.toLowerCase() === "y" || createEnv.toLowerCase() === "yes") {
    fs.writeFileSync(envFile, envContent);
    console.log("✅ Created .env.local file");
  }

  console.log("\n🔧 Step 3: Database Schema Setup");
  console.log("1. Open your Supabase project dashboard");
  console.log("2. Go to SQL Editor");
  console.log("3. Copy the content of database-setup.sql");
  console.log("4. Paste and run the SQL script\n");

  const sqlCopied = await question("Have you copied the SQL content? (y/N): ");

  if (sqlCopied.toLowerCase() === "y" || sqlCopied.toLowerCase() === "yes") {
    console.log("✅ Great! The database schema should now be set up.");
  }

  console.log("\n🔧 Step 4: Storage Buckets Setup");
  console.log("Run this SQL in your Supabase SQL Editor:");
  console.log("```sql");
  console.log("INSERT INTO storage.buckets (id, name, public) VALUES");
  console.log("  ('avatars', 'avatars', true),");
  console.log("  ('course-thumbnails', 'course-thumbnails', true),");
  console.log("  ('course-resources', 'course-resources', true);");
  console.log("```\n");

  const bucketsCreated = await question(
    "Have you created the storage buckets? (y/N): "
  );

  if (
    bucketsCreated.toLowerCase() === "y" ||
    bucketsCreated.toLowerCase() === "yes"
  ) {
    console.log("✅ Storage buckets created!");
  }

  console.log("\n🔧 Step 5: Verification");
  console.log("To verify your setup, you can:");
  console.log("1. Check the Tables section in Supabase dashboard");
  console.log("2. Verify RLS policies are enabled");
  console.log("3. Test the sample data was inserted");
  console.log("4. Run your Next.js application\n");

  console.log("🎉 Database setup complete!");
  console.log("\nNext steps:");
  console.log("1. Start your development server: npm run dev");
  console.log("2. Test authentication flow");
  console.log("3. Create your first course");
  console.log("4. Refer to DATABASE_SETUP.md for detailed usage\n");

  console.log("📚 Useful resources:");
  console.log("- DATABASE_SETUP.md - Detailed setup guide");
  console.log("- src/lib/database.ts - Database functions");
  console.log("- https://supabase.com/docs - Supabase documentation");

  rl.close();
}

main().catch((error) => {
  console.error("❌ Setup failed:", error);
  process.exit(1);
});
