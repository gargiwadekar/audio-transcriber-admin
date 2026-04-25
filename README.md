# Audio Transcriber Admin

Single-admin dashboard for uploading short audio clips, transcribing them with Gemini, and storing transcript text in PostgreSQL with Prisma and Better Auth.

## Stack

- Next.js 16 App Router
- TypeScript
- PostgreSQL
- Prisma ORM
- Better Auth
- Tailwind CSS
- shadcn-style UI components
- Gemini API via `@google/genai`
- Railway-ready deployment config

## Default Admin

- Email: `admin@audiotranscriber.com`
- Username: `admin`
- Password: `Admin@123`

The seed script creates this account in the database with a hashed password.

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required values:

- `DATABASE_URL`: pooled or standard PostgreSQL connection string
- `DIRECT_URL`: direct PostgreSQL connection string for Prisma migrations
- `BETTER_AUTH_SECRET`: long random secret
- `BETTER_AUTH_URL`: app base URL, for example `http://localhost:3000`
- `NEXT_PUBLIC_APP_URL`: public app URL, usually the same as `BETTER_AUTH_URL`
- `GEMINI_API_KEY`: Google AI Studio / Gemini API key
- `GEMINI_MODEL`: optional, defaults to `gemini-2.5-flash`

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Generate the Prisma client:

```bash
npm run db:generate
```

3. Apply the migration to your PostgreSQL database:

```bash
npm run db:migrate
```

4. Seed the default admin account:

```bash
npm run db:seed
```

5. Start development:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Core Features

- Single-admin login with Better Auth, username/email + password, protected dashboard routes, and logout
- Responsive login page with validation and show/hide password
- Dashboard stats, recent uploads, search, date filtering, and latest-first transcript sorting
- Audio upload validation for `mp3`, `wav`, and `m4a`
- Duration validation under 1 minute using `music-metadata`
- Gemini transcription integration with error handling and progress UI
- PostgreSQL persistence for transcript text only
- Transcript detail and delete workflows
- Toasts, empty states, and polished SaaS-style layout

## Future Scalability

- The current app is designed for short audio clips and a straightforward admin workflow.
- A future version can support longer recordings through chunking and transcript merging.
- Cloud storage can be added for managed file handling instead of in-memory upload processing.
- Async job processing can be introduced for larger transcription workloads and background retries.

## Database Commands

```bash
npm run db:generate
npm run db:migrate
npm run db:push
npm run db:seed
```

## Railway Deployment

This repo includes:

- `next.config.ts` with `output: "standalone"`
- `railway.json` with Railway deployment settings
- Prisma migrations in `prisma/migrations`

Recommended Railway setup:

1. Create a Railway project.
2. Add a PostgreSQL service.
3. Attach `DATABASE_URL` and `DIRECT_URL` reference variables to the web service.
4. Add the remaining auth and Gemini environment variables.
5. Set the pre-deploy command to:

```bash
npx prisma migrate deploy
```

6. Deploy from GitHub or `railway up`.

## Notes

- Audio files are never stored in the database.
- The upload route processes audio in-memory, sends it to Gemini, stores only transcript text, and discards the audio buffer.
- The middleware provides optimistic redirects, while server components and API routes perform actual session validation.
 

Developed by Gargi Wadekar for Burzt internship assignment.
