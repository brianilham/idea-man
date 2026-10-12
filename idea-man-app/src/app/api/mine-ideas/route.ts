import { NextRequest, NextResponse } from "next/server";
import { mineAndPersistIdeas } from "@/lib/ingestion/orchestrator";

// Increase serverless execution timeout to 60s for external Reddit fetching & Gemini extraction
export const maxDuration = 60;

/**
 * POST /api/mine-ideas
 * Triggers the autonomous Reddit mining and Supabase persistence pipeline
 */
export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Body is optional
      body = {};
    }

    const {
      subreddits,
      limit = 5,
      useMock = false,
      forceFallbackAI = false,
    } = body;

    const result = await mineAndPersistIdeas({
      subreddits: Array.isArray(subreddits) && subreddits.length > 0 ? subreddits : undefined,
      limit: typeof limit === "number" && limit > 0 ? Math.min(limit, 25) : 5,
      useMock: Boolean(useMock),
      forceFallbackAI: Boolean(forceFallbackAI),
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.errors?.join("; ") || "Mining pipeline failed",
          summary: {
            scanned: result.scannedCount,
            skipped: result.duplicatesSkipped,
            added: 0,
          },
          newIdeas: [],
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        summary: {
          scanned: result.scannedCount,
          skipped: result.duplicatesSkipped,
          added: result.newIdeasAdded,
        },
        newIdeas: result.ideas,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[API /api/mine-ideas] Unhandled error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal server error occurred during idea mining",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/mine-ideas
 * Health check or convenient browser trigger
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const subredditParam = searchParams.get("subreddit");
  const limitParam = searchParams.get("limit");
  const mockParam = searchParams.get("mock");

  const subreddits = subredditParam ? [subredditParam] : undefined;
  const limit = limitParam ? parseInt(limitParam, 10) : 3;
  const useMock = mockParam === "true" || mockParam === "1";

  const result = await mineAndPersistIdeas({
    subreddits,
    limit: isNaN(limit) ? 3 : Math.min(Math.max(limit, 1), 10),
    useMock,
  });

  return NextResponse.json({
    success: result.success,
    summary: {
      scanned: result.scannedCount,
      skipped: result.duplicatesSkipped,
      added: result.newIdeasAdded,
    },
    newIdeas: result.ideas,
    errors: result.errors,
  });
}
