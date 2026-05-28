<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Prokopton AI

AI-powered web app built for the **#juaravibecoding** competition.

## Live Demo

The app is live on **Google Cloud (Cloud Run)**:

- https://prokopton-998176570919.asia-southeast1.run.app/

## What this app does

Prokopton AI is an AI Studio / Gemini-powered TypeScript application that provides a simple web interface for interacting with an AI model. It’s designed to be easy to run locally, then deploy as a containerized app on Google Cloud.

## Tech Stack

- TypeScript
- Node.js
- Gemini (Google AI) API
- Google Cloud Run (deployment)

## Run locally

**Prerequisites:** Node.js

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create/set your environment variables (Gemini API key):

   - Set `GEMINI_API_KEY` in `.env.local`

3. Start the dev server:

   ```bash
   npm run dev
   ```
