# Social publisher setup

The publisher supports single-image posts to an Instagram professional account and a Facebook Page. Meta credentials stay server-side.

## Environment variables

Set these in the deployment environment (and locally in `.env.local`):

```env
META_GRAPH_API_VERSION=v25.0
META_INSTAGRAM_ACCOUNT_ID=
META_INSTAGRAM_ACCESS_TOKEN=
META_INSTAGRAM_USERNAME=
META_FACEBOOK_PAGE_ID=
META_FACEBOOK_PAGE_ACCESS_TOKEN=
SUPABASE_SERVICE_ROLE_KEY=
CRON_SECRET=
```

Instagram publishing requires an eligible professional account, a Meta app with content publishing permissions, and a token with access to the selected account. Facebook Page publishing requires a Page access token with permission to publish. Configure `CRON_SECRET` with a random value of at least 16 characters and use the same value in the deployment's environment settings. Never use the service role key in browser code.

## Database and storage

Apply `supabase/migrations/20261107090000_social_posts.sql` to the Supabase project. The migration creates the `social_posts` table, owner-scoped row policies, and the public `instagram-temp` bucket. Public read access is necessary so Meta can fetch scheduled images; write and delete access is scoped to the authenticated user's UID folder. Images are limited to 10 MB and JPEG, PNG, or WebP.

## Scheduler and timing

`vercel.json` invokes `/api/cron/social-publisher` every minute. The route requires the `CRON_SECRET` bearer header, claims due posts through their `publishing` state, publishes them, saves Meta's permalink, and deletes the temporary image. If Storage deletion is temporarily unavailable, later cron runs retry cleanup without republishing the post.

Vercel Hobby currently only supports cron jobs once per day and may invoke them at any point within the configured hour. Minute-level scheduling therefore requires a Vercel plan that permits minute-level cron execution or an external scheduler that calls the same protected endpoint. Cron expressions run in UTC; saved schedule timestamps are stored as UTC instants.

## Local use

The cron does not run automatically with `pnpm dev`. For local scheduled processing, call `GET /api/cron/social-publisher` with `Authorization: Bearer <CRON_SECRET>` from a local scheduler. The “Publicar agora” action works without the cron, but still requires Meta credentials.
