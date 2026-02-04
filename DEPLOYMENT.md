## Railway backend deployment

- Create a new Railway project and choose "Deploy from GitHub".
- Select this repo and set the service root directory to `backend`.
- Railway will use `railway.toml` and `nixpacks.toml` automatically.
- Add these environment variables in Railway:
  - `ENVIRONMENT=production`
  - `ANTHROPIC_API_KEY=...`
  - `ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app`
  - `FRONTEND_URL=https://your-frontend-domain.vercel.app`
  - `DATABASE_URL=...` (if you use a database)

Once deployed, copy the Railway service URL.

## Frontend configuration (Vercel)

- Set `NEXT_PUBLIC_BACKEND_URL` to your Railway service URL.
- Redeploy the frontend so it picks up the new env var.

## Notes

- `pdf_storage/` uses local disk on Railway and is ephemeral.
- If you need persistent storage, add S3 (or similar) later without changing the API surface.
