import * as fs from "fs";
import * as path from "path";
import { fetchRedditPosts } from "../src/lib/reddit/fetcher";
import { extractIdeaFromRedditPost } from "../src/lib/gemini/extractor";

// Helper to load env variables manually from .env.local
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
  console.log("🚀 Testing Reddit Fetcher & Gemini Extractor Pipeline (Ticket 03)");
  console.log("================================================================\n");

  console.log("1. Fetching raw posts from target subreddits...");
  const rawPosts = await fetchRedditPosts({
    subreddits: ["SomebodyMakeThis", "SideProject"],
    limit: 2,
    minSelftextLength: 30,
  });

  console.log(`✓ Fetched ${rawPosts.length} candidate Reddit posts:`);
  rawPosts.forEach((post, i) => {
    console.log(`   [${i + 1}] r/${post.subreddit} | "${post.title.substring(0, 50)}..." by u/${post.author}`);
  });

  console.log("\n2. Processing posts through Google Gemini Flash extraction engine...");
  for (let i = 0; i < rawPosts.length; i++) {
    const post = rawPosts[i];
    console.log(`\n--- Transforming Post #${i + 1} (${post.id}) ---`);
    const extracted = await extractIdeaFromRedditPost(post);

    console.log(`✨ Title:             ${extracted.title}`);
    console.log(`🏷️  Category:          ${extracted.category}`);
    console.log(`⚡ Difficulty:        ${extracted.difficulty}`);
    console.log(`🎯 Target Audience:   ${extracted.target_audience}`);
    console.log(`🛠️  Stack:             ${extracted.recommended_stack?.join(", ")}`);
    console.log(`📌 Subreddit:         r/${extracted.subreddit}`);
    console.log(`🔗 URL:               ${extracted.url}`);
    console.log(`📝 Problem:           ${extracted.problem_summary}`);
    console.log(`💡 Solution:          ${extracted.proposed_solution}`);
  }

  console.log("\n================================================================");
  console.log("✅ Ticket 03 Extraction Pipeline test completed successfully!");
  console.log("================================================================");
}

main().catch((err) => {
  console.error("❌ Extractor test encountered an error:", err);
  process.exit(1);
});
