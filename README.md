# Fac3less Client

This is the obfuscated client code for the Fac3less application.

## Setup

1. Copy `.env.example` to `.env`
2. Add your API keys to the `.env` file:
   - OpenRouter API key (get from https://openrouter.ai)
   - Replicate API key (get from https://replicate.com)
3. Run `npm install`
4. Run `npm run serve` to start the client

## Features

- Drag-and-drop workflow editor
- Local video processing with FFmpeg
- Real-time progress updates
- Template library

## API Keys

Your API keys are configured via the `.env` file:
- OPENROUTER_API_KEY: Your OpenRouter API key
- REPLICATE_API_KEY: Your Replicate API key

These keys are sent with each request and never stored on our servers.

## Building

To rebuild the client with your own API endpoint:
1. Update `API_URL` in your `.env` file
2. Run the build process from the parent directory
