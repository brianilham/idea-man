export type IdeaCategory = "Web App" | "DevTool" | "AI Tool" | "Automation";
export type FilterCategory = "All" | IdeaCategory;

export type IdeaDifficulty = "Beginner" | "Intermediate" | "Advanced";
export type FilterDifficulty = "All" | IdeaDifficulty;

// Backwards-compatible type aliases for UI controls
export type Category = FilterCategory;
export type Difficulty = FilterDifficulty;

export interface Idea {
  id: string;
  title: string;
  problem_summary: string;
  proposed_solution: string;
  target_audience: string;
  recommended_stack: string[];
  difficulty: IdeaDifficulty;
  category: IdeaCategory;
  upvotes: number;
  url: string;
  author: string;
  subreddit?: string;
  isNew?: boolean;
}

// Lightweight alias to avoid code duplication across legacy components
export type SpotlightIdea = Omit<Idea, "isNew">;

