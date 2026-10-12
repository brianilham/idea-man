import { SupabaseClient } from "@supabase/supabase-js";
import { Database, IdeaInsert, IdeaRow } from "../../types/database";
import { createAdminClient, isSupabaseConfigured } from "../supabase/admin";
import { fetchRedditPosts, type RedditRawPost } from "../reddit/fetcher";
import { extractIdeaFromRedditPost } from "../gemini/extractor";
import {
  canonicalizeUrl,
  isSemanticDuplicate,
} from "./deduplication";

export interface MiningOptions {
  subreddits?: string[];
  limit?: number;
  minSelftextLength?: number;
  useMock?: boolean;
  forceFallbackAI?: boolean;
  adminClient?: SupabaseClient<Database>;
}

export interface MiningResult {
  success: boolean;
  scannedCount: number;
  duplicatesSkipped: number;
  newIdeasAdded: number;
  ideas: IdeaRow[];
  errors?: string[];
}

/**
 * Pure deduplication helper: filters out Reddit posts whose canonical URLs
 * already exist in the database.
 */
export function deduplicatePostsAgainstUrls(
  posts: RedditRawPost[],
  existingUrls: string[]
): RedditRawPost[] {
  const existingSet = new Set(
    existingUrls.map((u) => canonicalizeUrl(u).toLowerCase())
  );
  return posts.filter(
    (post) => !existingSet.has(canonicalizeUrl(post.url).toLowerCase())
  );
}

/**
 * Filters out raw posts that are semantically duplicate with already indexed titles.
 */
export function filterSemanticDuplicatePosts(
  posts: RedditRawPost[],
  existingTitles: string[],
  threshold = 0.65
): { unique: RedditRawPost[]; skipped: number } {
  const unique: RedditRawPost[] = [];
  const trackedTitles = [...existingTitles];
  let skipped = 0;

  for (const post of posts) {
    if (isSemanticDuplicate(post.title, trackedTitles, threshold)) {
      skipped++;
      continue;
    }
    unique.push(post);
    trackedTitles.push(post.title);
  }

  return { unique, skipped };
}

/**
 * End-to-end Mining & Persistence Pipeline:
 * 1. Fetch raw Reddit posts from target subreddits
 * 2. Query Supabase ideas table to skip posts whose URLs already exist (idx_ideas_url)
 * 3. Extract structured blueprints for new unique posts via Gemini Flash
 * 4. Persist newly mined ideas to Supabase with is_new = true
 * 5. Return detailed execution summary
 */
export async function mineAndPersistIdeas(
  options?: MiningOptions
): Promise<MiningResult> {
  const {
    subreddits = ["SomebodyMakeThis", "SideProject", "webdev"],
    limit = 5,
    minSelftextLength = 30,
    useMock = false,
    forceFallbackAI = false,
  } = options || {};

  const client = options?.adminClient || createAdminClient();
  const hasLiveSupabase = isSupabaseConfigured();

  // 1. Fetch posts from Reddit
  let rawPosts: RedditRawPost[] = [];
  try {
    rawPosts = await fetchRedditPosts({
      subreddits,
      limit: Math.max(limit, 5),
      minSelftextLength,
      useMock,
    });
  } catch (err: any) {
    return {
      success: false,
      scannedCount: 0,
      duplicatesSkipped: 0,
      newIdeasAdded: 0,
      ideas: [],
      errors: [`Reddit fetch failed: ${err?.message || String(err)}`],
    };
  }

  const scannedCount = rawPosts.length;
  if (scannedCount === 0) {
    return {
      success: true,
      scannedCount: 0,
      duplicatesSkipped: 0,
      newIdeasAdded: 0,
      ideas: [],
    };
  }

  // 2. Query existing ideas in database for canonical URL & semantic comparison
  let existingUrls: string[] = [];
  let existingTitles: string[] = [];

  if (hasLiveSupabase) {
    try {
      const { data, error } = await client
        .from("ideas")
        .select("url, title");

      if (error) {
        console.warn("[Orchestrator] Error querying ideas in Supabase:", error.message);
      } else if (data) {
        existingUrls = data.map((row) => row.url);
        existingTitles = data.map((row) => row.title);
      }
    } catch (err) {
      console.warn("[Orchestrator] Deduplication query encountered an exception:", err);
    }
  }

  // 3. Layer 1: Canonical URL Deduplication
  const uniqueUrlPosts = deduplicatePostsAgainstUrls(rawPosts, existingUrls);
  const urlDuplicatesSkipped = scannedCount - uniqueUrlPosts.length;

  // 4. Layer 2: Pre-Extraction Semantic Duplicate Check
  const { unique: uniquePosts, skipped: semanticDuplicatesSkipped } =
    filterSemanticDuplicatePosts(uniqueUrlPosts, existingTitles, 0.65);

  let duplicatesSkipped = urlDuplicatesSkipped + semanticDuplicatesSkipped;

  if (uniquePosts.length === 0) {
    return {
      success: true,
      scannedCount,
      duplicatesSkipped,
      newIdeasAdded: 0,
      ideas: [],
    };
  }

  // 5. Extract structured idea blueprints via Gemini concurrently
  const postsToExtract = uniquePosts.slice(0, limit);
  const extractionPromises = postsToExtract.map(async (post) => {
    try {
      const idea = await extractIdeaFromRedditPost(post, {
        forceFallback: forceFallbackAI,
      });
      return idea;
    } catch (err) {
      console.warn(`[Orchestrator] Failed extracting idea for post ${post.id}:`, err);
      return null;
    }
  });

  const extractionResults = await Promise.all(extractionPromises);
  const rawIdeaInserts: IdeaInsert[] = extractionResults.filter(
    (idea): idea is IdeaInsert => idea !== null
  );

  // 6. Layer 3: Post-Extraction Blueprint Title Deduplication
  const newIdeaInserts: IdeaInsert[] = [];
  const currentTitlePool = [...existingTitles];

  for (const insertItem of rawIdeaInserts) {
    insertItem.url = canonicalizeUrl(insertItem.url);

    if (isSemanticDuplicate(insertItem.title, currentTitlePool, 0.70)) {
      duplicatesSkipped++;
      continue;
    }

    newIdeaInserts.push(insertItem);
    currentTitlePool.push(insertItem.title);
  }

  if (newIdeaInserts.length === 0) {
    return {
      success: true,
      scannedCount,
      duplicatesSkipped,
      newIdeasAdded: 0,
      ideas: [],
    };
  }

  // 5. Persist to Supabase ideas table
  if (hasLiveSupabase) {
    try {
      const { data, error } = await client
        .from("ideas")
        .insert(newIdeaInserts)
        .select();

      if (error) {
        console.error("[Orchestrator] Failed to insert new ideas into Supabase:", error.message);
        return {
          success: false,
          scannedCount,
          duplicatesSkipped,
          newIdeasAdded: 0,
          ideas: [],
          errors: [error.message],
        };
      }

      return {
        success: true,
        scannedCount,
        duplicatesSkipped,
        newIdeasAdded: (data || []).length,
        ideas: (data as IdeaRow[]) || [],
      };
    } catch (err: any) {
      console.error("[Orchestrator] Insertion exception:", err);
      return {
        success: false,
        scannedCount,
        duplicatesSkipped,
        newIdeasAdded: 0,
        ideas: [],
        errors: [err?.message || String(err)],
      };
    }
  }

  // Safe fallback simulation mode when Supabase credentials are not live
  const simulatedRows: IdeaRow[] = newIdeaInserts.map((insertItem, idx) => ({
    id: `sim_${Date.now()}_${idx}`,
    title: insertItem.title,
    problem_summary: insertItem.problem_summary,
    proposed_solution: insertItem.proposed_solution,
    target_audience: insertItem.target_audience,
    recommended_stack: insertItem.recommended_stack || [],
    difficulty: insertItem.difficulty,
    category: insertItem.category,
    upvotes: insertItem.upvotes || 0,
    url: insertItem.url,
    author: insertItem.author || "anonymous",
    subreddit: insertItem.subreddit || null,
    is_new: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  return {
    success: true,
    scannedCount,
    duplicatesSkipped,
    newIdeasAdded: simulatedRows.length,
    ideas: simulatedRows,
  };
}
