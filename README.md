# CarBot - AI Car Enthusiast Chatbot

A modern, AI-powered car enthusiast chatbot built with Next.js and Gemini 2.0 Flash. Get expert advice on cars, specifications, comparisons, and more!

## Features

- **Gemini 2.0 Flash** - Powered by Google's latest AI model
- **Google Search** - Real-time web search for up-to-date information
- **Modern UI** - Beautiful, responsive dark-mode interface
- **Real-time Streaming** - Watch responses appear word by word
- **Car Expertise** - Deep knowledge of vehicles, specs, and recommendations

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **AI SDK** - Vercel's AI SDK for streaming chat
- **Lucide React** - Beautiful icons

### Backend (Optional Go Server)
- **Go** - High-performance backend
- **Gemini AI** - Google's generative AI
- **Gorilla Mux** - HTTP router
- **CORS** - Cross-origin resource sharing

## Getting Started

### Prerequisites
- Node.js 18+
- Google AI API Key (get one at https://aistudio.google.com/app/apikey)

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```bash
cp .env.example .env.local
```

4. Add your Google AI API key to `.env.local`:
```
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Go Backend Setup (Optional)

The Go backend is an alternative implementation. The frontend already includes an API route using the AI SDK.

1. Navigate to the backend directory:
```bash
cd backend
```

2. Set your API key:
```bash
export GOOGLE_API_KEY=your_api_key_here
```

3. Run the server:
```bash
go run main.go
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the environment variable `GOOGLE_GENERATIVE_AI_API_KEY` in Vercel project settings
4. Deploy!

Or use the Vercel CLI:
```bash
cd frontend
npx vercel --prod
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Your Google AI API key for Gemini |

## Project Structure

```
CarBot/
├── frontend/           # Next.js frontend application
│   ├── src/
│   │   ├── app/       # App router pages and API routes
│   │   └── components/# React components
│   ├── public/        # Static assets
│   └── package.json
├── backend/           # Go backend (optional)
│   ├── main.go
│   └── go.mod
└── README.md
```

## API Routes

### POST /api/chat
Send a message and receive a streaming response.

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "What's the best sports car under $50k?" }
  ]
}
```

**Response:** Server-sent events stream with text chunks.

## License

MIT

## Acknowledgments

- [Vercel AI SDK](https://sdk.vercel.ai/)
- [Google Gemini](https://ai.google.dev/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
