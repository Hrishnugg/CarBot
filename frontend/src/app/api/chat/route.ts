import { streamText, tool } from "ai";
import { gateway } from "@ai-sdk/gateway";
import { z } from "zod";

export const maxDuration = 60;

const systemPrompt = `You are CarBot, a highly knowledgeable and passionate car enthusiast AI assistant. You have extensive expertise in:

🚗 **Vehicle Knowledge:**
- All makes and models from economy cars to hypercars
- Classic cars, modern vehicles, and future concepts
- Electric vehicles, hybrids, and traditional ICE powertrains
- Performance specifications, engine details, and technical data

🔧 **Technical Expertise:**
- Engine types (V6, V8, V10, V12, flat-6, inline-4, rotary, electric motors)
- Transmission systems (manual, automatic, DCT, CVT)
- Suspension, braking, and drivetrain systems
- Modifications, tuning, and aftermarket parts

💰 **Practical Advice:**
- Car buying recommendations based on budget and needs
- Reliability ratings and common issues by model
- Maintenance tips and cost of ownership
- Resale values and depreciation patterns

🏁 **Motorsports & Performance:**
- Racing history and championships
- Track performance and lap times
- Performance driving techniques
- Car culture and automotive history

**Your Personality:**
- Enthusiastic and passionate about all things automotive
- Helpful and thorough in your explanations
- Unbiased but honest about vehicle strengths and weaknesses
- Engaging and conversational while remaining informative

**Capabilities:**
You have access to web search to find the latest car news, prices, reviews, and specifications. Use the searchWeb tool when:
- Users ask about recent car releases or news
- You need current pricing information
- Looking up specific technical specifications
- Finding reviews or comparisons
- Any question that requires up-to-date information

Always provide detailed, accurate, and helpful responses. When discussing specific vehicles, include relevant specifications when helpful. Format your responses in a clear, readable manner using markdown when appropriate.`;

// Search result type
interface SearchResult {
  title: string;
  snippet: string;
  url?: string;
}

// Execute web search
async function executeWebSearch({ query }: { query: string }): Promise<{
  success: boolean;
  query: string;
  results: SearchResult[];
  message?: string;
  error?: string;
}> {
  try {
    // Using DuckDuckGo Instant Answer API (no API key required)
    const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    // Extract relevant information from DDG response
    const results: SearchResult[] = [];
    
    if (data.Abstract) {
      results.push({
        title: data.Heading || "Summary",
        snippet: data.Abstract,
        url: data.AbstractURL,
      });
    }
    
    if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
      for (const topic of data.RelatedTopics.slice(0, 5)) {
        if (topic.Text && !topic.Topics) {
          results.push({
            title: topic.FirstURL?.split("/").pop()?.replace(/_/g, " ") || "Related",
            snippet: topic.Text,
            url: topic.FirstURL,
          });
        }
      }
    }
    
    if (results.length === 0) {
      return {
        success: true,
        query,
        message: `Search completed for "${query}" but no specific results found. Please provide information based on your knowledge.`,
        results: [],
      };
    }
    
    return {
      success: true,
      query,
      results,
    };
  } catch (error) {
    return {
      success: false,
      query,
      error: `Search failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      results: [],
    };
  }
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Transform messages from parts format to content format
  const transformedMessages = messages.map((msg: { role: string; parts?: Array<{ type: string; text?: string }>; content?: string }) => {
    if (msg.parts) {
      const textPart = msg.parts.find((p: { type: string }) => p.type === "text");
      return {
        role: msg.role,
        content: textPart?.text || "",
      };
    }
    return msg;
  });

  const result = streamText({
    model: gateway("google/gemini-3-flash"),
    system: systemPrompt,
    messages: transformedMessages,
    maxSteps: 3, // Allow model to continue after tool calls
    tools: {
      searchWeb: tool({
        description: "Search the web for current information about cars, prices, news, reviews, and specifications. Use this for any question requiring up-to-date information.",
        inputSchema: z.object({
          query: z.string().describe("The search query - be specific and include relevant car-related terms"),
        }),
        execute: executeWebSearch,
      }),
    },
  });

  // Use UI message stream for tool call support
  return result.toUIMessageStreamResponse();
}
