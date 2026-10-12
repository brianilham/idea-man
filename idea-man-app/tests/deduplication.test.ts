import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  canonicalizeUrl,
  calculateTokenSimilarity,
  isSemanticDuplicate,
} from "../src/lib/ingestion/deduplication";

describe("Deduplication Engine", () => {
  it("should canonicalize URLs by removing query parameters, hash fragments, and trailing slashes", () => {
    const raw1 = "https://www.reddit.com/r/SomebodyMakeThis/comments/123/my_cool_idea/?scan_id=98765&ref=share";
    const raw2 = "https://www.reddit.com/r/SomebodyMakeThis/comments/123/my_cool_idea#comments";
    const raw3 = "https://www.reddit.com/r/SomebodyMakeThis/comments/123/my_cool_idea/";

    const canonical1 = canonicalizeUrl(raw1);
    const canonical2 = canonicalizeUrl(raw2);
    const canonical3 = canonicalizeUrl(raw3);

    assert.equal(canonical1, "https://www.reddit.com/r/SomebodyMakeThis/comments/123/my_cool_idea");
    assert.equal(canonical2, "https://www.reddit.com/r/SomebodyMakeThis/comments/123/my_cool_idea");
    assert.equal(canonical3, "https://www.reddit.com/r/SomebodyMakeThis/comments/123/my_cool_idea");
    assert.equal(canonical1, canonical2);
  });

  it("should calculate token similarity accurately between two texts", () => {
    const textA = "Local MultiScreen WebSocket Sync CLI";
    const textB = "Local Multi-Screen Sync CLI Tool with WebSockets";
    const similarity = calculateTokenSimilarity(textA, textB);

    assert.ok(similarity >= 0.6, `Similarity should be >= 0.6, got: ${similarity}`);

    const unrelated = "Receipt OCR & Expense Telegram Bot";
    const unrelatedSim = calculateTokenSimilarity(textA, unrelated);
    assert.ok(unrelatedSim < 0.2, `Unrelated similarity should be low, got: ${unrelatedSim}`);
  });

  it("should detect duplicate or redundant ideas based on threshold", () => {
    const existingTitles = [
      "Local MultiScreen WebSocket Sync CLI",
      "Stripe Churn Feedback Loop",
      "Figma To Tailwind Tokenizer",
    ];

    const duplicateCandidate = "Local Multi-Screen Sync CLI";
    const freshCandidate = "AI Smart Garden Irrigation Controller";

    assert.equal(isSemanticDuplicate(duplicateCandidate, existingTitles, 0.65), true);
    assert.equal(isSemanticDuplicate(freshCandidate, existingTitles, 0.65), false);
  });
});
