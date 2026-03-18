# SyncSocial

โพสต์โซเชียลง่ายๆ ในที่เดียว — A social media posting SaaS for Thai online merchants.

## Tech Stack

- **Frontend & Backend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Auth & Database:** Supabase (Email/Password)
- **Social Media Engine:** [Late API](https://getlate.dev)

## Getting Started

### 1. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor → New Query** and paste the contents of `supabase-schema.sql`
3. Run the query to create the `profiles` table, RLS policies, and triggers

### 2. Configure environment

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Fill in your Supabase and Late API credentials.
3. (Optional) Add `GEMINI_API_KEY` to enable AI content generation features (using Google Gemini).

### 3. Setup Storage (for Media)

1. Go to Supabase Dashboard -> Storage.
2. Create a new bucket named `media`.
3. Set it to Public.
4. Or run the SQL in `supabase-storage.sql` in the SQL Editor to set up policies automatically.

### 4. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
├── layout.tsx          # Root layout with animated SVG background
├── globals.css         # Tailwind + blob animations + toast styles
├── page.tsx            # Main dashboard (auth, connect, compose, post)
└── api/
    ├── profile/route.ts   # POST — Ensure Late profile exists
    ├── connect/route.ts   # GET  — Get OAuth URL for a platform
    ├── accounts/route.ts  # GET  — List connected social accounts
    └── post/route.ts      # POST — Publish post to selected platforms
lib/
├── late.ts             # Late API wrapper (profiles, connect, accounts, posts)
└── supabase/
    ├── client.ts       # Browser Supabase client
    └── server.ts       # Server Supabase client (cookies-based)
```

## API Mapping (Late API OpenAPI Spec)

| App Route           | Late API Endpoint            | Method |
|---------------------|------------------------------|--------|
| `/api/profile`      | `POST /v1/profiles`          | POST   |
| `/api/connect`      | `GET /v1/connect/{platform}` | GET    |
| `/api/accounts`     | `GET /v1/accounts`           | GET    |
| `/api/post`         | `POST /v1/posts`             | POST   |
