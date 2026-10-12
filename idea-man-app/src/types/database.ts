export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Category = "Web App" | "DevTool" | "AI Tool" | "Automation";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Database {
  public: {
    Tables: {
      ideas: {
        Row: {
          id: string;
          title: string;
          problem_summary: string;
          proposed_solution: string;
          target_audience: string;
          recommended_stack: string[];
          difficulty: Difficulty;
          category: Category;
          upvotes: number;
          url: string;
          author: string;
          subreddit: string | null;
          is_new: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          problem_summary: string;
          proposed_solution: string;
          target_audience: string;
          recommended_stack?: string[];
          difficulty: Difficulty;
          category: Category;
          upvotes?: number;
          url: string;
          author?: string;
          subreddit?: string | null;
          is_new?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          problem_summary?: string;
          proposed_solution?: string;
          target_audience?: string;
          recommended_stack?: string[];
          difficulty?: Difficulty;
          category?: Category;
          upvotes?: number;
          url?: string;
          author?: string;
          subreddit?: string | null;
          is_new?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type IdeaRow = Database["public"]["Tables"]["ideas"]["Row"];
export type IdeaInsert = Database["public"]["Tables"]["ideas"]["Insert"];
export type IdeaUpdate = Database["public"]["Tables"]["ideas"]["Update"];

