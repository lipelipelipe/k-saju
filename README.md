# SAJU — Korean Four Pillars

A lightweight, bilingual Saju experience built with the Next.js App Router, TypeScript, Tailwind CSS, and Lucide icons. The birth chart is calculated locally with the MIT-licensed [`manseryeok`](https://github.com/yhj1024/manseryeok) engine; birth details are not sent to our server.

## Run locally

```bash
npm install
npm run dev
```

## Birth-chart conventions

- The form accepts Gregorian solar dates and Korean lunisolar dates, including leap months.
- Choose the birthplace, IANA time zone, and longitude. Common cities fill in the latter two; other locations can be entered manually.
- The calculator converts the birthplace's civil time to the absolute moment, then applies longitude and equation-of-time correction for apparent solar time.
- Births with an unknown time display three pillars and do not invent an hour pillar.
- The day-boundary rule at 23:00 can be selected because Saju schools differ.
- The chart includes the Four Pillars, Ten Gods, void branches, and decade luck cycles when a male/female direction convention is available. The five-element bar counts visible stems and branches; it is not a hidden-stem weighting or seasonal-strength analysis, and luck-cycle starting ages follow the engine's documented solar-term convention.

The written reading is an entertainment and self-reflection interpretation keyed to the calculated Day Master, pillars, and selected focus. Astrology is not a scientifically validated way to predict a person's future.

## Email reports

The browser sends only the report content, language, and destination email to the app's API route; birth date, time, city, and longitude are not included. The server sends the report through Resend and does not store it. In production, Cloudflare Turnstile is verified server-side and Upstash applies shared rate limits across serverless instances.

Set these Vercel environment variables to enable email:

- `NEXT_PUBLIC_EMAIL_REPORTS_ENABLED=true`
- `RESEND_API_KEY` and `SAJU_FROM_EMAIL` (verify the sender domain in Resend)
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` (create a widget for the deployed host)
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (shared serverless rate limits: 5 emails per IP and 3 per recipient each hour)

## Social sharing

The report's share link omits name, email, birth date, time, city, and longitude. It contains the chart and free reading so that the shared link and its Open Graph preview can render without a database. KakaoTalk's native share requires `NEXT_PUBLIC_KAKAO_JS_KEY` and an app configured for the deployed domain. The system share sheet, Naver, WhatsApp, Facebook, and copy-link actions use the public share URL.

Set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS domain for social preview metadata. Vercel's `VERCEL_URL` is used automatically for preview deployments.

## Lemon Squeezy

Set `NEXT_PUBLIC_LEMON_SQUEEZY_URL` to your checkout URL and configure a Lemon Squeezy webhook for `order_created` at `/api/lemonsqueezy-webhook`. Add its signing secret as `LEMON_SQUEEZY_WEBHOOK_SECRET`, plus the expected store and variant IDs. The checkout API attaches an opaque report reference; after a verified paid order, the webhook emails the full report through Resend. Upstash temporarily holds the report for up to seven days while checkout completes; raw birth details are never stored. Configure this webhook URL in Lemon Squeezy and test with a test-mode purchase before launch.

## SEO dashboard and search engines

The Portuguese admin panel is at `/dashboard`. Configure `ADMIN_PASSWORD`, a long random `ADMIN_SESSION_SECRET`, and the Upstash Redis variables in Vercel before logging in. The panel stores bilingual SEO titles and descriptions, the production `*.vercel.app` URL, social preview image, and Google, Bing, and Naver verification values in Redis. The admin session is HTTP-only, signed, expires after 12 hours, and login attempts are rate-limited.

The English page is `/`; the Korean page is `/ko`. Both have canonical URLs and `hreflang` alternates. `/robots.txt` allows search crawlers while excluding admin/API routes, and `/sitemap.xml` lists both public pages. Individual shared readings are marked noindex. Add the exact production Vercel alias in the dashboard, then add the site as a property in Google Search Console, Bing Webmaster Tools, and Naver Search Advisor. Paste each service's verification code into the panel and submit `https://YOUR-PROJECT.vercel.app/sitemap.xml` there. Verification and sitemap submission request discovery; search engines decide when or whether to index and display pages.

See `.env.example` for every variable. Secrets must be entered in Vercel's server-side environment-variable settings; never prefix private credentials with `NEXT_PUBLIC_`.
