import { Database } from "@/types/database";
import { Idea } from "@/types/idea";
import { initialMockIdeas } from "@/data/mockIdeas";
import { createClient as createBrowserSupabaseClient } from "@/lib/supabase/client";

export type IdeaRow = Database["public"]["Tables"]["ideas"]["Row"];

/**
 * Maps a Supabase PostgreSQL row from `ideas` table to the frontend `Idea` interface.
 * Handles snake_case to camelCase conversion (e.g. `is_new` -> `isNew`),
 * provides safe defaults for nullish fields, and ensures clean types.
 */
export function mapDbIdeaToIdea(
  row: Partial<IdeaRow> & {
    id: string;
    title: string;
    problem_summary: string;
    proposed_solution: string;
  }
): Idea {
  return {
    id: String(row.id),
    title: row.title || "Untitled Project Idea",
    problem_summary: row.problem_summary || "",
    proposed_solution: row.proposed_solution || "",
    target_audience: row.target_audience || "Developers & Builders",
    recommended_stack: Array.isArray(row.recommended_stack)
      ? row.recommended_stack
      : [],
    difficulty: (row.difficulty as Idea["difficulty"]) || "Intermediate",
    category: (row.category as Idea["category"]) || "Web App",
    upvotes: typeof row.upvotes === "number" ? row.upvotes : 0,
    url: row.url || "",
    author: row.author || "anonymous",
    subreddit: row.subreddit || undefined,
    isNew: Boolean(row.is_new),
  };
}

/**
 * Fetches ideas from Supabase ordered by `created_at DESC`.
 * If Supabase is unreachable, credentials are placeholder, or no rows exist,
 * it gracefully falls back to `initialMockIdeas` so the application never fails.
 */
export async function fetchLiveIdeas(client?: any): Promise<Idea[]> {
  try {
    const supabase = client || createBrowserSupabaseClient();
    const { data, error } = await supabase
      .from("ideas")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn(
        "[Idea-man] Notice: Supabase fetch returned an error, falling back to local dataset:",
        error.message || error
      );
      return initialMockIdeas;
    }

    if (!data || data.length === 0) {
      return initialMockIdeas;
    }

    return data.map((row: any) => mapDbIdeaToIdea(row));
  } catch (err: any) {
    console.warn(
      "[Idea-man] Notice: Exception while fetching from Supabase, falling back to local dataset:",
      err?.message || err
    );
    return initialMockIdeas;
  }
}

/**
 * Searches ideas from Supabase using Full-Text Search (or ILIKE fallback).
 * If query is empty, delegates to fetchLiveIdeas.
 * Falls back safely to initialMockIdeas filtering if database is unconfigured.
 */
export async function searchLiveIdeas(
  query: string,
  client?: any
): Promise<Idea[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) {
    return fetchLiveIdeas(client);
  }

  try {
    const supabase = client || createBrowserSupabaseClient();
    const { data, error } = await supabase
      .from("ideas")
      .select("*")
      .or(
        `title.ilike.%${cleanQuery}%,problem_summary.ilike.%${cleanQuery}%,proposed_solution.ilike.%${cleanQuery}%`
      )
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      const q = cleanQuery.toLowerCase();
      return initialMockIdeas.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.problem_summary.toLowerCase().includes(q) ||
          i.proposed_solution.toLowerCase().includes(q) ||
          i.recommended_stack.some((s) => s.toLowerCase().includes(q))
      );
    }

    return data.map((row: any) => mapDbIdeaToIdea(row));
  } catch (err) {
    const q = cleanQuery.toLowerCase();
    return initialMockIdeas.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.problem_summary.toLowerCase().includes(q) ||
        i.proposed_solution.toLowerCase().includes(q) ||
        i.recommended_stack.some((s) => s.toLowerCase().includes(q))
    );
  }
}

