# Audiobookshelf Next

A bleeding-edge rewrite of Audiobookshelf using Next.js 16, React 19, Supabase, and Gemini AI.

## 🚀 Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/UI (Glassmorphism)
- **Database & Auth**: Supabase (PostgreSQL)
- **Caching**: Upstash (Redis)
- **Analytics**: MotherDuck (DuckDB)
- **AI**: Google Gemini 2.5/3.0
- **Rendering**: 120Hz GPU Accelerated Visualizers

## 🛠️ Setup & Installation

### 1. Environment Variables

Create a `.env.local` file in the root directory. **Use the API Keys provided in the prompt/Supabase dashboard**:

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_mQvJh78SEcR7xiSRs6WWkA_I1jB0A1t

# Google Gemini AI (Required for Summary/Chat/TTS)
API_KEY=your_gemini_api_key

# MotherDuck (Optional - Analytics)
MOTHERDUCK_TOKEN=your_motherduck_token

# Upstash Redis (Optional - Caching)
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🔄 Migration Guide

### Database Schema
Run the following SQL in your Supabase SQL Editor to set up the tables:

```sql
create table books (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  author text not null,
  description text,
  cover_url text,
  series text,
  duration integer default 0,
  genres text[] default '{}',
  created_at timestamptz default now()
);

-- Enable RLS
alter table books enable row level security;
create policy "Public read access" on books for select using (true);
```

## 🎨 GPU Rendering
The Player component uses a 2D Canvas context with `requestAnimationFrame` optimized for 120Hz displays. It simulates an audio visualizer. For full WebGL support, ensure hardware acceleration is enabled in your browser.
