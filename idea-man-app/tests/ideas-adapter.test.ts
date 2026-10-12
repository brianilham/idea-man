import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mapDbIdeaToIdea, fetchLiveIdeas } from "../src/lib/ideas/data";
import type { Database } from "../src/types/database";
import { initialMockIdeas } from "../src/data/mockIdeas";

type IdeaRow = Database["public"]["Tables"]["ideas"]["Row"];

describe("Ideas Data Adapter", () => {
  const mockDbRow: IdeaRow = {
    id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    title: "Real DB Mined Idea",
    problem_summary: "Real problem statement from Reddit.",
    proposed_solution: "Real proposed software solution.",
    target_audience: "Web Developers",
    recommended_stack: ["Next.js", "Tailwind CSS"],
    difficulty: "Intermediate",
    category: "DevTool",
    upvotes: 42,
    url: "https://reddit.com/r/SideProject/comments/123",
    author: "reddit_user",
    subreddit: "SideProject",
    is_new: true,
    created_at: "2026-10-11T12:00:00Z",
    updated_at: "2026-10-11T12:00:00Z",
  };

  it("should correctly map a database IdeaRow to an application Idea", () => {
    const mapped = mapDbIdeaToIdea(mockDbRow);

    assert.equal(mapped.id, mockDbRow.id);
    assert.equal(mapped.title, mockDbRow.title);
    assert.equal(mapped.problem_summary, mockDbRow.problem_summary);
    assert.equal(mapped.proposed_solution, mockDbRow.proposed_solution);
    assert.equal(mapped.target_audience, mockDbRow.target_audience);
    assert.deepEqual(mapped.recommended_stack, ["Next.js", "Tailwind CSS"]);
    assert.equal(mapped.difficulty, "Intermediate");
    assert.equal(mapped.category, "DevTool");
    assert.equal(mapped.upvotes, 42);
    assert.equal(mapped.url, mockDbRow.url);
    assert.equal(mapped.author, "reddit_user");
    assert.equal(mapped.subreddit, "SideProject");
    assert.equal(mapped.isNew, true);
  });

  it("should handle nullish or default values gracefully in mapDbIdeaToIdea", () => {
    const sparseRow: any = {
      id: "sparse-id",
      title: "Sparse Idea",
      problem_summary: "Sparse problem",
      proposed_solution: "Sparse solution",
      difficulty: "Beginner",
      category: "Web App",
      url: "https://reddit.com/r/test",
      // missing recommended_stack, target_audience, is_new, author
    };

    const mapped = mapDbIdeaToIdea(sparseRow);
    assert.equal(mapped.id, "sparse-id");
    assert.deepEqual(mapped.recommended_stack, []);
    assert.equal(mapped.author, "anonymous");
    assert.equal(mapped.isNew, false);
    assert.equal(mapped.upvotes, 0);
  });

  it("should fetch ideas using a mock Supabase client and map them", async () => {
    const fakeClient: any = {
      from: () => ({
        select: () => ({
          order: () => Promise.resolve({ data: [mockDbRow], error: null }),
        }),
      }),
    };

    const result = await fetchLiveIdeas(fakeClient);
    assert.equal(result.length, 1);
    assert.equal(result[0].title, "Real DB Mined Idea");
    assert.equal(result[0].isNew, true);
  });

  it("should gracefully fallback to initialMockIdeas if Supabase query fails or returns empty", async () => {
    const errorClient: any = {
      from: () => ({
        select: () => ({
          order: () => Promise.resolve({ data: null, error: new Error("Network timeout") }),
        }),
      }),
    };

    const resultOnError = await fetchLiveIdeas(errorClient);
    assert.ok(resultOnError.length >= initialMockIdeas.length);
    assert.equal(resultOnError[0].id, initialMockIdeas[0].id);

    const emptyClient: any = {
      from: () => ({
        select: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
    };

    const resultOnEmpty = await fetchLiveIdeas(emptyClient);
    assert.ok(resultOnEmpty.length >= initialMockIdeas.length);
  });
});
