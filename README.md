# ResumePro

ResumePro is a Vercel-ready SaaS website for creating job-winning resumes, checking ATS compatibility, and generating cover letters.

## What is included

- Next.js App Router + TypeScript
- Tailwind CSS
- Prisma schema for Vercel Postgres
- NextAuth-ready auth structure
- Groq AI integration plan
- PayPal MVP payment flow plan
- Resume Builder
- ATS Resume Checker
- Cover Letter Generator
- Free vs Pro monetization system

## Monetization model

### Free
- 1 resume
- 2 free templates
- PDF export with watermark
- 3 AI generations per day
- Basic ATS score
- 1 cover letter per day

### Pro
- $4.99/month or $29/year
- Unlimited resumes
- Premium templates
- No watermark
- Advanced ATS report
- More AI generations
- Unlimited cover letters

## Local setup

```bash
npm install
cp .env.example .env
npx prisma generate
npm run dev
```

## Vercel deployment

1. Import this GitHub repo into Vercel.
2. Add Vercel Postgres database.
3. Add env variables from `.env.example`.
4. Run build command: `npm run build`.
5. Deploy.

## Important production notes

PayPal MVP flow can unlock Pro after successful approval, but production should verify PayPal payment/subscription using PayPal API or webhooks before activating Pro.

Groq API key must only be used server-side.
