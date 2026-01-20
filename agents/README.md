# The Idea Sandbox Production Suite

A Next.js app for podcast production that helps editors (Shay & Sai) generate titles, descriptions, transitions, and thumbnails using Claude AI.

## Features

- **Title Generation**: 5 title options with rationales following TISB voice guidelines
- **Description Generation**: Structured descriptions with hook, context, topics, and boilerplate
- **Transition Generation**: Visual overlay moments for video editing (TOPIC_SHIFT, CLAIM_MOMENT, DATA_POINT, DEFINITION)
- **Chat Refinement**: Conversational interface to refine generated outputs
- **Token Tracking**: Daily usage limits (100K tokens/day)

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS (dark mode)
- **Database**: Neon Postgres
- **LLM**: Claude claude-sonnet-4-5-20250514 via Anthropic API
- **Deployment**: Vercel

## Environment Variables

```env
DATABASE_URL=postgresql://...
ANTHROPIC_API_KEY=sk-ant-...
APP_PASSWORD=your-secure-password
```

## Database Setup

Run these SQL commands in Neon:

```sql
-- agent_outputs: stores all generated content
CREATE TABLE agent_outputs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_type VARCHAR(50) NOT NULL,
    input_hash VARCHAR(64),
    output JSONB NOT NULL,
    selected BOOLEAN DEFAULT FALSE,
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- api_usage: tracks token usage for rate limiting
CREATE TABLE api_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(50) DEFAULT 'shay_sai',
    tokens_used INTEGER NOT NULL,
    endpoint VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- selections: tracks which outputs were chosen (for future training)
CREATE TABLE selections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    output_id UUID REFERENCES agent_outputs(id),
    agent_type VARCHAR(50),
    selected_option INTEGER,
    final_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Development

```bash
cd agents
npm install
npm run dev
```

Open http://localhost:3000

## Deployment to Vercel

1. Create a new Vercel project pointing to the `agents` subdirectory
2. Set environment variables in Vercel dashboard
3. Configure subdomain `agents.tisb.world`

## API Routes

- `POST /api/auth` - Login with password
- `DELETE /api/auth` - Logout
- `POST /api/generate` - Generate titles/descriptions/transitions
- `POST /api/chat` - Chat for refinement
- `POST /api/select` - Log user selections
- `GET /api/usage` - Get daily token usage

## Future Enhancements

- RAG integration with Substack blogs and past episodes
- Thumbnail generation via Leonardo API
- Vector embeddings for knowledge corpus
- Feedback loop for training
