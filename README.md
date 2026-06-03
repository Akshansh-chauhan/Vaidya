# Vaidya — AI Health Companion

Vaidya is a full-stack AI health companion application that provides preliminary, non-diagnostic health assessments across four clinical domains: postural biomechanics, dermatology, ophthalmology, and mental wellness. 

Built with **Next.js 14**, **Tailwind CSS v4**, **Radix UI**, and a fine-tuned **Llama 3.2 90B Vision** model with PPO safety alignment.

Hosted on Vercel: https://evaidya.site/

## Features

- **Spine & Posture Analysis** — Upload photos/videos for AI-powered posture assessment
- **Dermatology Scan** — Skin condition analysis with image recognition
- **Ophthalmology Check** — Eye health assessment and vision screening
- **Mental Health Screening** — Voice and text-based mental wellness evaluation
- **Multi-language Support** — 10 languages (EN, ES, FR, DE, HI, ZH, JA, AR, IT, PT)
- **Voice I/O** — Speech-to-text input and text-to-speech responses
- **Health Reports** — Downloadable PDF reports with clinical recommendations
- **Exercise Plans** — Personalised health improvement programs with progress tracking

## System Architecture

Vaidya features a production-grade decoupled architecture designed for scale and privacy:

### Hybrid AI Inference Strategy
To guarantee uptime and minimize latency, Vaidya implements a hybrid fallback inference router (`lib/local-vlm.ts`).
1. **Primary**: Routes requests to the locally hosted fine-tuned **Vaidya VLM v1** inference sidecar.
2. **Fallback**: If the local VLM is unavailable or timeouts (due to local GPU resource constraints), it transparently falls back to the cloud via the **NVIDIA NIM API** (running the `meta/llama-3.2-90b-vision-instruct` base).

### Reinforcement Learning Pipeline (PPO-RLHF)
The local Vaidya VLM is heavily aligned for medical safety using a custom Proximal Policy Optimization (PPO) pipeline implemented in PyTorch and TRL. 
- **Composite Reward Model**: Evaluates responses across 4 dimensions: preference (Bradley-Terry), safety classification, image-text grounding, and strict rule-based penalties for dangerous advice (e.g. providing definitive diagnoses or failing to recommend a doctor).
- **PEFT / LoRA**: The 90B parameter model is trained efficiently using 4-bit quantization and LoRA adapters targeting the top transformer layers and vision-language cross-attention projector.
- **Async Grading Engine**: Validates the model output with a secondary evaluation pass to assign confidence and severity scores to health records.

### Security and Privacy
- **Supabase Auth & RLS**: Strict Row Level Security policies ensure that a user can only access their own health records and exercise progress. Database access is cryptographically bounded to the JWT.
- **Output Sanitization**: All AI responses pass through deep sanitization to strip markdown, HTML injection, and XSS patterns before rendering.

## Getting Started

### Prerequisites
- Node.js 18+ (install via [nvm](https://github.com/nvm-sh/nvm))
- pnpm (`npm install -g pnpm`)

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment template and add your API keys
cp .env.example .env.local
# Edit .env.local and set NVIDIA_API_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4 + Radix UI (shadcn/ui)
- **AI**: Vaidya VLM v1 (fine-tuned Llama 3.2 90B Vision) with NVIDIA NIM cloud fallback
- **Training**: PPO-RLHF with composite reward model (PyTorch + TRL + PEFT)
- **Language**: TypeScript (frontend) / Python (training pipeline)
- **Database**: Supabase (PostgreSQL + Row Level Security)
- **Auth**: Supabase Auth (JWT + RLS)
- **Hosting**: Vercel
