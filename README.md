# ResumePro

ResumePro is a Vercel-ready full-stack SaaS resume platform built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, Vercel Postgres, NextAuth credentials authentication, Groq AI, PayPal subscriptions, and client-side PDF export.

Free users can create one resume, use two templates, run basic ATS checks, generate limited AI content, create one cover letter per day, and export PDFs with a watermark. Pro users unlock unlimited resumes, premium templates, no-watermark PDFs, advanced ATS analysis, more AI generations, unlimited cover letters, and resume optimization workflows.

## Features

- Landing page with SEO metadata, pricing preview, feature sections, FAQ, and CTAs.
- Email/password signup and login with bcrypt password hashing.
- Protected dashboard with plan, usage, resume count, actions, and saved resumes.
- Resume builder with live preview, template gating, save/update/delete, AI summary, AI skills, and PDF export.
- Rule-based ATS checker with keyword, skills, section, readability, and contact scoring.
- Groq-powered cover letter generation with Free and Pro usage limits.
- PayPal subscription buttons for Pro Monthly and Pro Yearly.
- SEO landing pages for resume summaries, skills, headlines, cover letters, and ATS checking.
- Prisma data model for users, resumes, usage, and payments.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- Vercel Postgres
- NextAuth credentials provider
- Groq API through the OpenAI-compatible SDK
- PayPal JavaScript SDK through `@paypal/react-paypal-js`
- `html2pdf.js` for PDF export

## Local Setup

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Set `DATABASE_URL` to a Vercel Postgres or compatible Postgres connection string, then generate Prisma:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Run the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

On Windows PowerShell, if script execution blocks `npm`, use `npm.cmd` and `npx.cmd`.

## Environment Variables

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

GROQ_API_KEY=
GROQ_MODEL=llama-3.3-70b-versatile

NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_PRO_MONTHLY_PLAN_ID=
PAYPAL_PRO_YEARLY_PLAN_ID=

APP_URL=http://localhost:3000
```

`GROQ_API_KEY` is used only on the server. If it is missing, AI routes return useful fallback text so the MVP remains testable.

## Vercel Deployment

1. Create a Vercel project from this repository.
2. Add Vercel Postgres and copy its pooled connection string into `DATABASE_URL`.
3. Add all environment variables in Vercel Project Settings.
4. Set `NEXTAUTH_URL` and `APP_URL` to the production domain.
5. Run Prisma migration against production:

```bash
npx prisma migrate deploy
```

6. Deploy with Vercel. The `build` script runs `prisma generate && next build`.

## PayPal Setup

1. Create a PayPal developer app and copy the client ID into `NEXT_PUBLIC_PAYPAL_CLIENT_ID`.
2. Create monthly and yearly subscription plans in PayPal.
3. Add the plan IDs to `PAYPAL_PRO_MONTHLY_PLAN_ID` and `PAYPAL_PRO_YEARLY_PLAN_ID`.
4. Add the PayPal client secret to `PAYPAL_CLIENT_SECRET` for future production verification.
5. Test the subscription buttons on `/pricing`.

For MVP testing, `/api/paypal/activate-pro` stores the PayPal subscription ID and upgrades the user to Pro after approval.

## PayPal Production Verification

Before unlocking Pro in production, replace the MVP activation behavior with full PayPal verification:

- Verify the subscription ID with the PayPal API before updating the user plan.
- Verify webhook signatures on `/api/paypal/webhook`.
- Listen for subscription activated, suspended, canceled, payment failed, and payment completed events.
- Reconcile `User.paypalSubscriptionStatus`, `User.plan`, and `Payment` records from webhook events.
- Treat PayPal webhooks as the source of truth for long-term subscription status.

## Groq Setup

1. Create a Groq API key.
2. Add it to `GROQ_API_KEY`.
3. Keep `GROQ_MODEL=llama-3.3-70b-versatile` or change it to another supported Groq model.
4. AI routes use the OpenAI-compatible base URL `https://api.groq.com/openai/v1`.

## Useful Commands

```bash
npm run dev
npm run build
npm run typecheck
npx prisma validate
npx prisma generate
npx prisma migrate dev --name init
npx prisma studio
```
