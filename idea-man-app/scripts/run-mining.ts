import * as fs from "fs";
import * as path from "path";
import { mineAndPersistIdeas } from "../src/lib/ingestion/orchestrator";
import { isSupabaseConfigured } from "../src/lib/supabase/admin";

// Load environment variables manually from .env.local / .env
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

loadEnv();

async function main() {
  console.log("================================================================");
  console.log("⛏️  Autonomous Idea Mining & Supabase Persistence Engine (Ticket 04)");
  console.log("================================================================\n");

  const isLiveDb = isSupabaseConfigured();
  console.log(`Database Status: ${isLiveDb ? "🟢 Connected to Supabase Live" : "🟡 Safe Fallback Simulation Mode (Credentials unconfigured)"}`);

  console.log("Initiating mining pipeline across r/SomebodyMakeThis and r/SideProject...");

  const result = await mineAndPersistIdeas({
    subreddits: ["SomebodyMakeThis", "SideProject"],
    limit: 5,
    minSelftextLength: 30,
  });

  console.log("\n📊 Execution Summary:");
  console.log(`   - Scanned Posts:        ${result.scannedCount}`);
  console.log(`   - Duplicates Skipped:   ${result.duplicatesSkipped}`);
  console.log(`   - New Ideas Added:      ${result.newIdeasAdded}`);

  if (result.ideas.length > 0) {
    console.log("\n💡 Ingested Blueprints:");
    result.ideas.forEach((idea, i) => {
      console.log(`\n[#${i + 1}] ${idea.title}`);
      console.log(`    Category:     ${idea.category} | Difficulty: ${idea.difficulty}`);
      console.log(`    Stack:        ${idea.recommended_stack?.join(", ")}`);
      console.log(`    Subreddit:    r/${idea.subreddit}`);
      console.log(`    Audience:     ${idea.target_audience}`);
      console.log(`    URL:          ${idea.url}`);
      console.log(`    Problem:      ${idea.problem_summary}`);
      console.log(`    Solution:     ${idea.proposed_solution}`);
    });
  } else {
    console.log("\nℹ️ No new unique ideas to ingest (all candidate posts already exist in database).");
  }

  if (result.errors && result.errors.length > 0) {
    console.warn("\n⚠️ Noticeable errors/warnings during run:", result.errors.join("\n"));
  }

  console.log("\n================================================================");
  console.log("✅ Mining pipeline run finished successfully!");
  console.log("================================================================");
}

main().catch((err) => {
  console.error("❌ Fatal mining error:", err);
  process.exit(1);
});
