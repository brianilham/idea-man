import { createClient } from "@supabase/supabase-js";
import { spotlightIdeas, initialMockIdeas } from "../src/data/mockIdeas";
import type { Database, IdeaInsert } from "../src/types/database";
import * as fs from "fs";
import * as path from "path";

// Load environment variables manually from .env.local or .env without extra deps
function loadEnvFile(fileName: string) {
  const filePath = path.resolve(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf-8");
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

loadEnvFile(".env.local");
loadEnvFile(".env");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function seed() {
  console.log("🌱 Starting Supabase seed process for Idea-man...");

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("placeholder") || !supabaseUrl.startsWith("http")) {
    console.error(
      "❌ Error: Valid Supabase environment variables are missing.\n" +
      "Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local"
    );
    process.exit(1);
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseKey);

  // Combine spotlight & mock ideas, mapping to Supabase IdeaInsert
  const allIdeas: IdeaInsert[] = [
    ...spotlightIdeas.map((item) => ({
      title: item.title,
      problem_summary: item.problem_summary,
      proposed_solution: item.proposed_solution,
      target_audience: item.target_audience || "General Builders",
      recommended_stack: item.recommended_stack,
      difficulty: item.difficulty,
      category: item.category,
      upvotes: item.upvotes,
      url: item.url,
      author: item.author,
      subreddit: item.subreddit || (item.url.includes("/r/") ? item.url.split("/r/")[1]?.split("/")[0] : null),
      is_new: true,
    })),
    ...initialMockIdeas.map((item) => ({
      title: item.title,
      problem_summary: item.problem_summary,
      proposed_solution: item.proposed_solution,
      target_audience: item.target_audience || "General Builders",
      recommended_stack: item.recommended_stack,
      difficulty: item.difficulty,
      category: item.category,
      upvotes: item.upvotes,
      url: item.url,
      author: item.author,
      subreddit: item.subreddit || (item.url.includes("/r/") ? item.url.split("/r/")[1]?.split("/")[0] : null),
      is_new: Boolean(item.isNew),
    })),
  ];

  // Deduplicate by URL before upsert
  const uniqueIdeasMap = new Map<string, IdeaInsert>();
  for (const idea of allIdeas) {
    uniqueIdeasMap.set(idea.url, idea);
  }
  const uniqueIdeas = Array.from(uniqueIdeasMap.values());

  console.log(`📦 Upserting ${uniqueIdeas.length} blueprint ideas into 'ideas' table...`);

  const { data, error } = await supabase
    .from("ideas")
    .upsert(uniqueIdeas, { onConflict: "url" })
    .select();

  if (error) {
    console.error("❌ Failed to seed ideas:", error.message);
    process.exit(1);
  }

  console.log(`✅ Successfully inserted/updated ${data.length} ideas in Supabase!`);
}

seed().catch((err) => {
  console.error("❌ Unhandled seed error:", err);
  process.exit(1);
});
