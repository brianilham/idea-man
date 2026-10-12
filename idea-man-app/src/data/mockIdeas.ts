import { Idea } from "../types/idea";

export const initialMockIdeas: Idea[] = [
  {
    id: "1",
    title: "One-Tap Supply Restock Button",
    problem_summary:
      "Small care centers and shared offices run out of essential paper towels, gloves, and disinfectant unexpectedly because logging inventory into spreadsheets is tedious.",
    proposed_solution:
      "A 1-tap mobile dashboard or QR-code button that instantly notifies the inventory manager and adds items to a restock shopping list.",
    target_audience: "Small Business & Office Coordinators",
    recommended_stack: ["React", "Supabase", "Twilio API"],
    difficulty: "Beginner",
    category: "Automation",
    upvotes: 94,
    url: "https://www.reddit.com/r/SomebodyMakeThis/comments/1x37veq/somebody_make_a_onetap_were_running_low_button/",
    author: "KSS_app",
    subreddit: "SomebodyMakeThis",
  },
  {
    id: "2",
    title: "Contextual Timing Reminder",
    problem_summary:
      "Traditional clock alarms fail when tasks need to be recalled based on immediate physical context, location, or active workflow rather than specific hours.",
    proposed_solution:
      "A smart reminder assistant that triggers actionable checklist alerts exactly when the user reaches their workspace or transit point.",
    target_audience: "Busy Freelancers & Commuters",
    recommended_stack: ["React Native", "PostgreSQL", "Geolocation API"],
    difficulty: "Intermediate",
    category: "Web App",
    upvotes: 89,
    url: "https://www.reddit.com/r/SomebodyMakeThis/comments/1x39316/help_me_help_you/",
    author: "Miserable-Book-7462",
    subreddit: "SomebodyMakeThis",
  },
  {
    id: "3",
    title: "Micro-Friction In-App Feedback",
    problem_summary:
      "Software teams lack qualitative insights into subtle workflow friction, awkward workarounds, and quiet frustrations that cause users to abandon apps.",
    proposed_solution:
      "A 2-line embeddable widget that prompts 1-click frustration logs right after repetitive actions with automatic bug diagnostics.",
    target_audience: "Product Managers & SaaS Founders",
    recommended_stack: ["React", "Tailwind CSS", "Supabase"],
    difficulty: "Intermediate",
    category: "DevTool",
    upvotes: 112,
    url: "https://www.reddit.com/r/SomebodyMakeThis/comments/1x32fls/whats_a_small_frustrating_problem_you_wish/",
    author: "Immediate-Prune4075",
    subreddit: "SomebodyMakeThis",
  },
  {
    id: "4",
    title: "Edge AI Micro-Model Benchmark",
    problem_summary:
      "Machine learning developers working with constrained hardware struggle to benchmark quantized models and evaluate local inference speed.",
    proposed_solution:
      "An automated benchmarking playground that runs quantized models locally across diverse device profiles and produces latency reports.",
    target_audience: "AI Engineers & Edge Developers",
    recommended_stack: ["TypeScript", "WebGPU", "Next.js"],
    difficulty: "Advanced",
    category: "AI Tool",
    upvotes: 126,
    url: "https://www.reddit.com/r/SomebodyMakeThis/comments/1x2jddf/building_and_exploring_ideas_ai_technology_and/",
    author: "Any_Internal5311",
    subreddit: "SomebodyMakeThis",
  },
  {
    id: "5",
    title: "Multi-Display Interactive Game Canvas",
    problem_summary:
      "Game developers building local multiplayer experiences struggle to orchestrate multiple projectors and peripheral displays into an immersive synchronized setup.",
    proposed_solution:
      "A lightweight local WebSocket protocol and projection mapping tool that synchronizes secondary ambient screens with the main game state.",
    target_audience: "Indie Game Developers & Creative Techs",
    recommended_stack: ["Node.js", "WebSockets", "Canvas API"],
    difficulty: "Intermediate",
    category: "DevTool",
    upvotes: 78,
    url: "https://www.reddit.com/r/SideProject/comments/1ww85ra/games_with_projectors_and_extra_screens/",
    author: "Funny_Guava_8071",
    subreddit: "SideProject",
  },
  {
    id: "6",
    title: "Everyday Pain-Point Radar",
    problem_summary:
      "Builders and makers waste months building speculative apps nobody wants because discovering verified, recurring complaints across communities is chaotic.",
    proposed_solution:
      "An automated qualitative problem aggregator that extracts genuine user frustrations from Reddit discussions into ranked opportunity blueprints.",
    target_audience: "Indie Hackers & Product Managers",
    recommended_stack: ["Next.js", "Gemini Flash", "PostgreSQL"],
    difficulty: "Intermediate",
    category: "AI Tool",
    upvotes: 184,
    url: "https://www.reddit.com/r/SomebodyMakeThis/comments/1wvvzss/im_looking_for_real_problems_not_startup_ideas/",
    author: "OBSERVERTHINGS",
    subreddit: "SomebodyMakeThis",
  },
];
