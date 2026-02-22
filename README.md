# Proof Platform

Proof is a production-grade, billion-dollar job marketplace platform that replaces resumes with validated work samples. We focus on transparency, demonstrated ability, and merit.

## Architecture

This is a Turborepo monorepo encompassing:
- `apps/web`: React 18 + Vite Web App
- `apps/mobile`: React Native + Expo App
- `apps/api`: Node.js 20 Fastify Backend
- `services/ai-service`: Python FastAPI AI Microservice
- `services/video-processor`: Background Job Worker
- `services/notification-service`: Push/Email Service
- `packages/*`: Shared utilities, types, and configs

## Stack
- Fastify, PostgreSQL 16, Redis 7, Prisma 5, BullMQ, Socket.io
- React, Tailwind, Zustand, React Query
- Python, FFmpeg
- Docker, Terraform, Kubernetes, GitHub Actions

## Setup & Running Locally

1. Ensure Node.js 20+ and Docker are installed.
2. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill the variables.
4. Start the infrastructure (Postgres, Redis) via Docker Compose:
   ```bash
   docker-compose up -d
   ```
5. Run migrations:
   ```bash
   npm run build --filter=@proof/api
   ```
6. Start the development servers:
   ```bash
   npm run dev
   ```

## Development Guidelines
- Always follow the rules outlined in `.antigravity`.
- Ensure conventional commits format: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, `ai:`, `perf:`.
- Enforce strict typing, handle errors meticulously, and never commit secrets.
