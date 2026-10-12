import { GoogleGenAI } from "@google/genai";
import type { Category, Difficulty, IdeaInsert } from "../../types/database";
import type { RedditRawPost } from "../reddit/fetcher";

export interface ExtractedIdea {
  title: string;
  problem_summary: string;
  proposed_solution: string;
  target_audience: string;
  recommended_stack: string[];
  difficulty: Difficulty;
  category: Category;
}

export type ExtractedIdeaResult = IdeaInsert;

export interface ExtractionOptions {
  apiKey?: string;
  model?: string;
  forceFallback?: boolean;
}

const VALID_CATEGORIES: Category[] = ["Web App", "DevTool", "AI Tool", "Automation"];
const VALID_DIFFICULTIES: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];

/**
 * Validate and sanitize raw JSON output into guaranteed strict types
 */
export function validateExtractedIdea(raw: any): ExtractedIdea {
  const title = String(raw?.title || "Untitled Project Idea").trim();
  const problemSummary = String(
    raw?.problem_summary || raw?.problemSummary || "Problem description not provided."
  ).trim();
  const proposedSolution = String(
    raw?.proposed_solution || raw?.proposedSolution || "Proposed solution not provided."
  ).trim();
  const targetAudience = String(
    raw?.target_audience || raw?.targetAudience || "Software Builders & Tech Enthusiasts"
  ).trim();

  // Normalize recommended_stack into string[]
  let recommendedStack: string[] = [];
  if (Array.isArray(raw?.recommended_stack || raw?.recommendedStack)) {
    recommendedStack = (raw.recommended_stack || raw.recommendedStack)
      .map((s: any) => String(s).trim())
      .filter(Boolean);
  } else if (typeof raw?.recommended_stack === "string") {
    recommendedStack = raw.recommended_stack
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);
  }
  if (recommendedStack.length === 0) {
    recommendedStack = ["TypeScript", "Next.js", "PostgreSQL"];
  }

  // Validate difficulty
  let difficulty: Difficulty = "Intermediate";
  const rawDiff = String(raw?.difficulty || "").trim();
  if (VALID_DIFFICULTIES.includes(rawDiff as Difficulty)) {
    difficulty = rawDiff as Difficulty;
  }

  // Validate category
  let category: Category = "DevTool";
  const rawCat = String(raw?.category || "").trim();
  if (VALID_CATEGORIES.includes(rawCat as Category)) {
    category = rawCat as Category;
  }

  return {
    title,
    problem_summary: problemSummary,
    proposed_solution: proposedSolution,
    target_audience: targetAudience,
    recommended_stack: recommendedStack,
    difficulty,
    category,
  };
}

/**
 * Heuristic fallback extractor when Gemini API Key is missing or rate-limited
 */
export function heuristicFallbackExtract(post: RedditRawPost): ExtractedIdea {
  const lowerText = `${post.title} ${post.selftext}`.toLowerCase();

  // Determine Category
  let category: Category = "Web App";
  if (
    lowerText.includes("ai") ||
    lowerText.includes("gpt") ||
    lowerText.includes("llm") ||
    lowerText.includes("model") ||
    lowerText.includes("gemini")
  ) {
    category = "AI Tool";
  } else if (
    lowerText.includes("cli") ||
    lowerText.includes("git") ||
    lowerText.includes("terminal") ||
    lowerText.includes("dev") ||
    lowerText.includes("pr ") ||
    lowerText.includes("action") ||
    lowerText.includes("docker")
  ) {
    category = "DevTool";
  } else if (
    lowerText.includes("bot") ||
    lowerText.includes("automate") ||
    lowerText.includes("cron") ||
    lowerText.includes("sync") ||
    lowerText.includes("telegram") ||
    lowerText.includes("discord")
  ) {
    category = "Automation";
  }

  // Determine Difficulty
  let difficulty: Difficulty = "Intermediate";
  if (
    lowerText.includes("proxy") ||
    lowerText.includes("ast") ||
    lowerText.includes("compiler") ||
    lowerText.includes("kernel") ||
    lowerText.includes("distributed")
  ) {
    difficulty = "Advanced";
  } else if (
    lowerText.includes("simple") ||
    lowerText.includes("beginner") ||
    lowerText.includes("widget") ||
    lowerText.includes("starter")
  ) {
    difficulty = "Beginner";
  }

  // Generate catchy clean title
  let cleanTitle = post.title
    .replace(/^somebody please make a/i, "")
    .replace(/^somebody make a/i, "")
    .replace(/^i wish someone made an?/i, "")
    .replace(/^need an?/i, "")
    .replace(/^why is/i, "")
    .trim();
  cleanTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
  if (cleanTitle.length > 55) {
    cleanTitle = cleanTitle.substring(0, 52) + "...";
  }

  // Format problem & solution
  const firstSentence = post.selftext.split(".")[0]?.trim() || post.title;
  const problem = firstSentence.length > 10 ? `${firstSentence}.` : post.title;
  const solution = `A specialized software application that addresses: "${cleanTitle}" with an automated workflow.`;

  // Stacks based on category
  const stacks: Record<Category, string[]> = {
    "AI Tool": ["TypeScript", "Gemini 3.5 Flash", "Next.js"],
    DevTool: ["Go / Rust", "TypeScript", "Node.js"],
    Automation: ["Python", "FastAPI", "Supabase"],
    "Web App": ["Next.js", "Tailwind CSS", "PostgreSQL"],
  };

  return {
    title: cleanTitle,
    problem_summary: problem,
    proposed_solution: solution,
    target_audience: "Builders & Software Developers",
    recommended_stack: stacks[category],
    difficulty,
    category,
  };
}

/**
 * System instruction and schema definition for Gemini Flash
 */
const SYSTEM_INSTRUCTION = `
You are an expert product ideation analyst and tech startup evaluator.
Your job is to read raw Reddit posts from developer/maker communities (r/SomebodyMakeThis, r/SideProject, r/Entrepreneur)
and convert genuine user complaints and requests into crisp, actionable software project blueprints.

Rules:
1. "title": Catchy, professional product title (3 to 6 words, strictly under 50 characters). Never use generic clickbait like "Ultimate Tool" or "Revolutionary App".
2. "problem_summary": 1-2 clear sentences summarizing the real-world frustration or pain point experienced by the user.
3. "proposed_solution": 1-2 clear sentences detailing a practical software/developer tool architecture to solve it.
4. "target_audience": Concrete user persona (e.g. "Solo Developers & Code Streamers", "Open Source Maintainers", "Freelance Designers").
5. "recommended_stack": Array of 2 to 4 modern, complementary technologies (e.g. ["Next.js", "Tailwind CSS", "Supabase"]).
6. "difficulty": Exactly one of ["Beginner", "Intermediate", "Advanced"].
7. "category": Exactly one of ["Web App", "DevTool", "AI Tool", "Automation"].

Output format: You MUST return a single valid JSON object with the specified keys.
`;

/**
 * Extract an actionable Idea blueprint from a Reddit post using Google Gemini Flash
 */
export async function extractIdeaFromRedditPost(
  post: RedditRawPost,
  options?: ExtractionOptions
): Promise<ExtractedIdeaResult> {
  const apiKey =
    options?.apiKey ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  const modelName =
    options?.model ||
    process.env.GEMINI_MODEL ||
    "gemini-3.5-flash-lite";

  // If no API key or forced fallback, run heuristic fallback
  if (!apiKey || apiKey === "your-gemini-api-key" || options?.forceFallback) {
    const fallbackIdea = heuristicFallbackExtract(post);
    return {
      ...fallbackIdea,
      url: post.url,
      author: post.author,
      subreddit: post.subreddit,
      upvotes: post.score,
      is_new: true,
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const promptText = `
Reddit Post Subreddit: r/${post.subreddit}
Reddit Post Title: ${post.title}
Reddit Post Body:
${post.selftext}
`;

    const generatePromise = ai.models.generateContent({
      model: modelName,
      contents: promptText,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    const timeoutMs = 8000;
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Gemini request timed out after ${timeoutMs}ms`)),
        timeoutMs
      )
    );

    const response = await Promise.race([generatePromise, timeoutPromise]);

    const responseText = response.text?.trim() || "";
    let parsedJson: any;

    try {
      parsedJson = JSON.parse(responseText);
    } catch {
      // In case Gemini wrapped output in markdown code blocks
      const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      parsedJson = JSON.parse(cleaned);
    }

    const validated = validateExtractedIdea(parsedJson);

    return {
      ...validated,
      url: post.url,
      author: post.author,
      subreddit: post.subreddit,
      upvotes: post.score,
      is_new: true,
    };
  } catch (error) {
    console.warn(
      `[Gemini Extractor] Failed to extract idea with Gemini model (${modelName}). Using heuristic fallback. Reason:`,
      error
    );

    const fallbackIdea = heuristicFallbackExtract(post);
    return {
      ...fallbackIdea,
      url: post.url,
      author: post.author,
      subreddit: post.subreddit,
      upvotes: post.score,
      is_new: true,
    };
  }
}
