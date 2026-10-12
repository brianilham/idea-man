# Idea-man

Software project idea radar that extracts verified problems from Reddit discussions and turns them into buildable blueprints.

Production deployment: https://idea-man-nine.vercel.app

## Overview

Idea-man finds real problems developers can build solutions for. Instead of generating fictional prompts, it pulls active complaint threads from developer and indie hacker communities on Reddit (`r/SomebodyMakeThis`, `r/SideProject`, and `r/webdev`), filters promotional noise, and uses Google Gemini to turn unstructured posts into structured project blueprints.

Each blueprint includes:
- Problem statement extracted from the original discussion
- Proposed application architecture and core feature set
- Recommended technology stack
- Difficulty tier (Beginner, Intermediate, Advanced)
- Category classification (Web App, DevTool, AI Tool, Automation)
- Direct link and author attribution to the original Reddit thread

The interface requires no user accounts. Bookmarked ideas persist in the user's browser via `localStorage` with cross-tab synchronization.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server and Client Components)
- **UI Library**: React 19, Tailwind CSS v4, Lucide React
- **Database**: Supabase PostgreSQL
- **AI Model**: Google Gemini Flash (`gemini-3.5-flash-lite` via `@google/genai`)
- **Data Ingestion**: Reddit Atom RSS parser with HTTP API fallback
- **Test Runner**: Node test runner executed through `tsx`

## Project Structure

```text
idea-man/
├── idea-man-app/              # Next.js application root
│   ├── src/
│   │   ├── app/               # App Router pages and API route handlers
│   │   │   ├── api/mine-ideas # Mining pipeline endpoint
│   │   │   ├── saved/         # Local bookmark view
│   │   │   └── search/        # Search and filter view
│   │   ├── components/        # React UI components (IdeaCard, FilterBar, modals)
│   │   ├── hooks/             # Custom state hooks (useBookmarks via useSyncExternalStore)
│   │   ├── lib/               # Core business logic
│   │   │   ├── db/            # Supabase database adapter and query helpers
│   │   │   ├── gemini/        # Gemini API client, schema parser, fallback generator
│   │   │   ├── ingestion/     # Mining orchestrator and deduplication engine
│   │   │   └── reddit/        # Reddit RSS parser and HTTP client
│   │   └── types/             # Domain TypeScript definitions
│   └── tests/                 # Unit and integration test suites
├── supabase/
│   ├── migrations/            # SQL migration files
│   └── seed.sql               # Starter blueprint seed dataset
├── DEPLOYMENT.md              # Production infrastructure documentation
├── PRODUCT.md                 # Product specifications and boundary definitions
└── SPEC.md                    # Technical system specification
```

## Local Development

### Prerequisites

- Node.js 20+
- npm 10+
- Google Gemini API key from Google AI Studio
- Supabase project (or local Supabase CLI instance)

### 1. Clone the repository

```bash
git clone https://github.com/brianilham/idea-man.git
cd idea-man/idea-man-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file inside `idea-man-app/`:

```env
# Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-3.5-flash-lite
```

If Supabase credentials are not provided, the application runs in local fallback mode using seeded mock data.

### 4. Set up database schema

Apply the database schema in your Supabase SQL editor:

1. Run `supabase/migrations/01_create_ideas.sql` to create the `ideas` table and performance indexes.
2. Run `supabase/seed.sql` to populate initial curated project ideas.

### 5. Run the development server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Testing

The test suite covers Reddit RSS parsing, token similarity deduplication, Gemini schema normalization, database adapters, and authentication boundary checks.

Run all tests:

```bash
cd idea-man-app
npm test
```

Run manual ingestion script:

```bash
cd idea-man-app
npm run mine
```

## Production Deployment

The project deploys to Vercel with database hosting on Supabase Cloud.

When configuring the project in Vercel:
1. Set the **Root Directory** to `idea-man-app`.
2. Add the environment variables listed in the configuration section (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, and `GEMINI_MODEL`).
3. Deploy branch `main`.

Detailed production deployment instructions are documented in [`DEPLOYMENT.md`](DEPLOYMENT.md).

## License

MIT
