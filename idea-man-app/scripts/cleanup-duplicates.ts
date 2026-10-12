import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";
import { canonicalizeUrl, calculateTokenSimilarity } from "../src/lib/ingestion/deduplication";

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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Supabase credentials missing in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanDuplicates() {
  console.log("🧹 Starting database deduplication cleanup...");

  const { data: rows, error } = await supabase
    .from("ideas")
    .select("id, title, url, created_at")
    .order("created_at", { ascending: false });

  if (error || !rows) {
    console.error("❌ Failed to query ideas:", error);
    process.exit(1);
  }

  console.log(`📊 Total rows in database before cleanup: ${rows.length}`);

  const keptRows: typeof rows = [];
  const idsToDelete: string[] = [];

  for (const row of rows) {
    const canonical = canonicalizeUrl(row.url);

    // 1. Check if canonical URL already exists in kept rows
    const isUrlDup = keptRows.some(
      (k) => canonicalizeUrl(k.url).toLowerCase() === canonical.toLowerCase()
    );

    // 2. Check if title is semantically duplicate with kept rows
    const isTitleDup = keptRows.some(
      (k) => calculateTokenSimilarity(row.title, k.title) >= 0.70
    );

    if (isUrlDup || isTitleDup) {
      idsToDelete.push(row.id);
    } else {
      keptRows.push(row);
    }
  }

  console.log(`🔍 Unique records to keep: ${keptRows.length}`);
  console.log(`🗑️  Duplicate records identified to delete: ${idsToDelete.length}`);

  if (idsToDelete.length > 0) {
    const { error: delError } = await supabase
      .from("ideas")
      .delete()
      .in("id", idsToDelete);

    if (delError) {
      console.error("❌ Error deleting duplicate rows:", delError);
      process.exit(1);
    }
    console.log(`✅ Successfully removed ${idsToDelete.length} duplicates from Supabase!`);
  } else {
    console.log("✨ No duplicates found to remove.");
  }

  // Also clean the URLs of kept rows to be purely canonical
  console.log("🔄 Normalizing canonical URLs on remaining rows...");
  for (const item of keptRows) {
    const cleanUrl = canonicalizeUrl(item.url);
    if (cleanUrl !== item.url) {
      await supabase.from("ideas").update({ url: cleanUrl }).eq("id", item.id);
    }
  }

  console.log("🏁 Database cleanup finished successfully!");
}

cleanDuplicates().catch((err) => {
  console.error("❌ Fatal error during cleanup:", err);
  process.exit(1);
});
