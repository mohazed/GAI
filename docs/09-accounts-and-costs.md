# 09 — Accounts, keys and costs

Everything free unless marked. Create these in order before running the prompts that need them (the prompt list says which).

| # | Account / key | Needed for | Cost | Needed by prompt | How |
|---|---|---|---|---|---|
| 1 | **GitHub** repository https://github.com/mohazed/GAI (done, public, empty) | code, data, CI, issue forms, discussions | free (Actions minutes are unlimited for public repos) | P-01 | done; P-01 enables Discussions |
| 2 | **Cloudflare** account | static hosting, later DNS for the domain | free (Pages: 500 builds/month, 20 000 files and 25 MiB per file per deployment, unmetered bandwidth) | P-12 | dash.cloudflare.com → sign up; create an API token with "Cloudflare Pages: Edit" (or "Workers Scripts: Edit" if the dashboard steers you to Workers static assets, which is the same free tier) and note the Account ID; the deploy prompt creates the project from the CLI |
| 3 | **Domain** | production URL | ≈ 10–15 €/year (the only cost) | optional, any time; the site runs on `{project}.pages.dev` until then | buy at Cloudflare Registrar (at-cost pricing) so DNS and hosting are one account |
| 4 | **Contact address** (optional at launch) | a public contact for right of reply and reviewer outreach; not needed to build | free | P-10 (About page) | any address you are willing to publish: an existing one, an alias, or none at launch (GitHub issue forms are the channel until then) |
| 5 | **UN Comtrade** free "Basic Individual" key | A2 and C3 fetcher (500 calls/day, 100 000 records per call, HS-6 bilateral data included) | free | P-04 (test fetch) and P-14 | create an account at comtrade.un.org, then request the key at comtradedeveloper.un.org → `.env` as `COMTRADE_KEY` (never committed) |
| 6 | **Internet Archive** account (**required**: anonymous Save Page Now is throttled to the point of returning 429 immediately) | authenticated Save Page Now (SPN2: 5 concurrent captures, 100 000/day) | free | before P-04 and every data session | archive.org → sign up → https://archive.org/account/s3.php → generate keys → `.env` as `IA_ACCESS_KEY` / `IA_SECRET_KEY` |
| 7 | **SIPRI Arms Transfers Database** export | A1, A4 | free, no login observed | P-14 | armstransfers.sipri.org → Data → TIV tables → recipient Israel by supplier (deliveries) and supplier Israel by recipient (orders) → Export to CSV; latest release 9 March 2026 with data through 2025 |
| 8 | **OCHA FTS**, **World Bank**, **UN Digital Library**, **ICJ**, **ICC**, **UNRWA** | public data | free, no account | — | the UN Digital Library sits behind a bot challenge: the P-14 session downloads its bulk GA voting CSV (record 4060887) and the SIPRI export with the built-in browser; you only approve the download prompt if the app asks |
| 9 | (optional) **Cloudflare Web Analytics** | cookieless page counts | free | P-12 | toggle in the Pages project; no script from third parties |

Not needed: Anthropic API key (D-03), Vercel, Supabase, Neon, any object storage, any form service, any font service, any analytics vendor, any map-tile provider.

## Running costs

| Item | Monthly |
|---|---|
| Hosting, CI, archives, data | 0 € |
| Domain | ≈ 1 € (annual fee spread) |
| Claude Code usage for data sessions | your existing subscription |

## Where secrets live

`.env` at the repo root, git-ignored, with `.env.example` committed. GitHub Actions secrets only for the two Cloudflare values. Nothing else, ever.

## MCP servers and tools used by the build sessions

None are required. Data sessions use Claude Code's built-in web search and fetch tools and the shell (`curl`, `pnpm archive`). If a government site blocks fetches, the session may use the built-in browser (Claude Browser tools) or Claude in Chrome if you have it, reading only; it never logs into anything.
