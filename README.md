# Vaidya — AI Health Companion

An AI-powered health assistant providing comprehensive analysis for posture, skin conditions, eye health, and mental wellness. Built with **Next.js 14**, **Tailwind CSS v4**, **Radix UI**, and **Google Gemini AI**.

Hosted on Vercel : https://evaidya.site/

## Features

- **Spine & Posture Analysis** — Upload photos/videos for AI-powered posture assessment
- **Dermatology Scan** — Skin condition analysis with image recognition
- **Ophthalmology Check** — Eye health assessment and vision screening
- **Mental Health Screening** — Voice and text-based mental wellness evaluation
- **Multi-language Support** — 10 languages (EN, ES, FR, DE, HI, ZH, JA, AR, IT, PT)
- **Voice I/O** — Speech-to-text input and text-to-speech responses
- **Health Reports** — Downloadable reports with recommendations
- **Exercise Plans** — Personalised health improvement programs

## Getting Started

### Prerequisites
- Node.js 18+ (install via [nvm](https://github.com/nvm-sh/nvm))
- pnpm (`npm install -g pnpm`)

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment template and add your API key
cp .env.example .env.local
# Edit .env.local and set GEMINI_API_KEY

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).


### Deployment

This app is deployed on **Vercel**. Push to `main` to auto-deploy.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4 + Radix UI (shadcn/ui)
- **AI**: Google Gemini API (`gemini-2.5-flash-preview`)
- **Language**: TypeScript
- **Storage**: JSONBlob (health records)
- **Hosting**: Vercel
