/**
 * Deduplication Engine for Idea-man
 * Provides canonical URL stripping and fast in-memory semantic token similarity.
 */

const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from",
  "has", "he", "in", "is", "it", "its", "of", "on", "that", "the",
  "to", "was", "were", "will", "with", "app", "tool", "project",
  "make", "made", "somebody", "i", "need", "looking", "want", "like",
]);

/**
 * Normalizes a URL by stripping query parameters, URL fragments,
 * trailing slashes, and standardizing protocol/host.
 */
export function canonicalizeUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== "string") return "";

  try {
    const parsed = new URL(rawUrl.trim());
    // Strip hash and search/query params
    parsed.hash = "";
    parsed.search = "";

    let pathname = parsed.pathname;
    // Strip trailing slashes
    while (pathname.length > 1 && pathname.endsWith("/")) {
      pathname = pathname.slice(0, -1);
    }
    parsed.pathname = pathname;

    return parsed.toString();
  } catch {
    // If not a full URL with protocol, perform simple string stripping
    let cleaned = rawUrl.trim().split("?")[0].split("#")[0];
    while (cleaned.length > 1 && cleaned.endsWith("/")) {
      cleaned = cleaned.slice(0, -1);
    }
    return cleaned;
  }
}

/**
 * Tokenizes and normalizes text into meaningful lowercase tokens (filtering out stopwords).
 * Handles camelCase (e.g. MultiScreen -> multi, screen), punctuation, and word boundaries.
 */
export function tokenizeText(text: string): Set<string> {
  if (!text) return new Set();

  // Split camelCase boundaries (e.g. MultiScreen -> Multi Screen, WebSocket -> Web Socket)
  const expanded = text.replace(/([a-z])([A-Z])/g, "$1 $2");

  const words = expanded
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));

  return new Set(words);
}

/**
 * Calculates token similarity between text A and text B.
 * Uses Overlap / Dice coefficient which handles subsets (e.g. "Local Multi-Screen Sync CLI"
 * matching "Local MultiScreen WebSocket Sync CLI") much better than raw strict Jaccard.
 */
export function calculateTokenSimilarity(textA: string, textB: string): number {
  const setA = tokenizeText(textA);
  const setB = tokenizeText(textB);

  if (setA.size === 0 || setB.size === 0) return 0;

  let intersectionSize = 0;
  for (const token of setA) {
    if (setB.has(token)) {
      intersectionSize++;
    }
  }

  // Overlap coefficient: intersection / min(setA, setB)
  // This detects when one title is essentially a restatement/subset of another
  const minSize = Math.min(setA.size, setB.size);
  const overlap = intersectionSize / minSize;

  // Dice coefficient: (2 * intersection) / (setA + setB)
  const dice = (2 * intersectionSize) / (setA.size + setB.size);

  // Return the higher of overlap or dice to balance containment and similarity
  return Math.max(overlap, dice);
}

/**
 * Checks if a candidate text has a similarity score >= threshold against any existing target texts.
 */
export function isSemanticDuplicate(
  candidateText: string,
  existingTexts: string[],
  threshold = 0.65
): boolean {
  if (!candidateText || existingTexts.length === 0) return false;

  for (const existing of existingTexts) {
    const score = calculateTokenSimilarity(candidateText, existing);
    if (score >= threshold) {
      return true;
    }
  }

  return false;
}
