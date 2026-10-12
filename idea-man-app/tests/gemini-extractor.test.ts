import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  extractIdeaFromRedditPost,
  validateExtractedIdea,
  type ExtractedIdea,
} from "../src/lib/gemini/extractor";
import type { RedditRawPost } from "../src/lib/reddit/fetcher";

describe("Gemini Extractor Module", () => {
  const samplePost: RedditRawPost = {
    id: "test_1",
    title: "Somebody make a terminal dictation tool that formats git commit messages",
    selftext:
      "I want to speak out loud what I coded, and have AI format it into conventional commits (feat:, fix:) so I don't break typing flow.",
    author: "coder_bob",
    url: "https://reddit.com/r/SomebodyMakeThis/comments/test_1",
    permalink: "/r/SomebodyMakeThis/comments/test_1",
    subreddit: "SomebodyMakeThis",
    score: 42,
    createdAt: 1712830000,
  };

  it("should validate and normalize valid extracted ideas", () => {
    const rawAiOutput: ExtractedIdea = {
      title: "Git Commit Voice Dictator",
      problem_summary: "Typing conventional commit messages breaks engineering flow.",
      proposed_solution: "A local CLI daemon that converts voice explanations into conventional commit syntax.",
      target_audience: "Solo Developers",
      recommended_stack: ["Rust", "Web Speech API", "Gemini Flash"],
      difficulty: "Beginner",
      category: "AI Tool",
    };

    const validated = validateExtractedIdea(rawAiOutput);
    assert.equal(validated.title, "Git Commit Voice Dictator");
    assert.equal(validated.difficulty, "Beginner");
    assert.equal(validated.category, "AI Tool");
    assert.ok(Array.isArray(validated.recommended_stack));
  });

  it("should normalize invalid category or difficulty to safe defaults", () => {
    const messyOutput: any = {
      title: "Messy Idea",
      problem_summary: "Problem description.",
      proposed_solution: "Solution description.",
      target_audience: "Devs",
      recommended_stack: "Python, Flask", // string instead of array
      difficulty: "SuperHard", // invalid enum
      category: "SomethingElse", // invalid enum
    };

    const normalized = validateExtractedIdea(messyOutput);
    assert.equal(normalized.difficulty, "Intermediate"); // default
    assert.equal(normalized.category, "DevTool"); // default
    assert.deepEqual(normalized.recommended_stack, ["Python", "Flask"]);
  });

  it("should extract idea using fallback mode when API key is not configured", async () => {
    const result = await extractIdeaFromRedditPost(samplePost, { forceFallback: true });

    assert.ok(result.title.length > 0);
    assert.ok(result.problem_summary.length > 0);
    assert.ok(result.proposed_solution.length > 0);
    assert.ok(["Beginner", "Intermediate", "Advanced"].includes(result.difficulty));
    assert.ok(["Web App", "DevTool", "AI Tool", "Automation"].includes(result.category));

    // Metadata preservation
    assert.equal(result.url, samplePost.url);
    assert.equal(result.author, samplePost.author);
    assert.equal(result.subreddit, "SomebodyMakeThis");
    assert.equal(result.upvotes, 42);
    assert.equal(result.is_new, true);
  });
});
