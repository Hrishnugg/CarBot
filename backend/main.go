package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/google/generative-ai-go/genai"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"google.golang.org/api/option"
)

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type ChatRequest struct {
	Messages []Message `json:"messages"`
}

type ChatResponse struct {
	Response    string   `json:"response"`
	Sources     []Source `json:"sources,omitempty"`
	ToolResults []string `json:"toolResults,omitempty"`
}

type Source struct {
	Title string `json:"title"`
	URL   string `json:"url"`
}

type CarSpecsResult struct {
	Make        string `json:"make"`
	Model       string `json:"model"`
	Year        int    `json:"year"`
	Horsepower  int    `json:"horsepower"`
	Torque      string `json:"torque"`
	ZeroToSixty string `json:"zeroToSixty"`
	TopSpeed    string `json:"topSpeed"`
	Engine      string `json:"engine"`
	Price       string `json:"price"`
}

type CarComparisonResult struct {
	Car1   CarSpecsResult `json:"car1"`
	Car2   CarSpecsResult `json:"car2"`
	Winner string         `json:"winner"`
	Reason string         `json:"reason"`
}

var client *genai.Client
var model *genai.GenerativeModel

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

**Available Tools:**
You have access to web search to find the latest car news, prices, reviews, and specifications. Use it when:
- Users ask about recent car releases or news
- You need current pricing information
- Looking up specific technical specifications
- Finding reviews or comparisons

Always provide detailed, accurate, and helpful responses. When discussing specific vehicles, include relevant specifications when helpful. Format your responses in a clear, readable manner using markdown when appropriate.`

func initGemini() error {
	ctx := context.Background()
	apiKey := os.Getenv("GOOGLE_API_KEY")
	if apiKey == "" {
		apiKey = os.Getenv("GEMINI_API_KEY")
	}
	if apiKey == "" {
		return fmt.Errorf("GOOGLE_API_KEY or GEMINI_API_KEY environment variable is required")
	}

	var err error
	client, err = genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return fmt.Errorf("failed to create Gemini client: %w", err)
	}

	// Use Gemini 3 Flash Preview model
	model = client.GenerativeModel("gemini-3-flash-preview")

	// Configure the model
	model.SetTemperature(0.7)
	model.SetTopP(0.9)
	model.SetTopK(40)
	model.SetMaxOutputTokens(2048)

	// Set the system instruction
	model.SystemInstruction = &genai.Content{
		Parts: []genai.Part{
			genai.Text(systemPrompt),
		},
	}

	log.Println("Gemini 3 Flash Preview model initialized successfully")
	return nil
}

func chatHandler(w http.ResponseWriter, r *http.Request) {
	var req ChatRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	ctx := context.Background()

	// Build the conversation history
	var history []*genai.Content
	for _, msg := range req.Messages[:len(req.Messages)-1] {
		role := "user"
		if msg.Role == "assistant" {
			role = "model"
		}
		history = append(history, &genai.Content{
			Role:  role,
			Parts: []genai.Part{genai.Text(msg.Content)},
		})
	}

	// Start a chat session with history
	chat := model.StartChat()
	chat.History = history

	// Get the latest user message
	latestMessage := req.Messages[len(req.Messages)-1].Content

	// Send the message and get streaming response
	iter := chat.SendMessageStream(ctx, genai.Text(latestMessage))

	// Set headers for streaming
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming not supported", http.StatusInternalServerError)
		return
	}

	var sources []Source
	var toolResults []string

	for {
		resp, err := iter.Next()
		if err != nil {
			if err.Error() == "iterator done" || strings.Contains(err.Error(), "no more items") {
				break
			}
			// Send error event
			fmt.Fprintf(w, "data: {\"error\": \"%s\"}\n\n", err.Error())
			flusher.Flush()
			break
		}

		for _, candidate := range resp.Candidates {
			if candidate.Content != nil {
				for _, part := range candidate.Content.Parts {
					switch p := part.(type) {
					case genai.Text:
						// Send text chunk
						chunk := map[string]interface{}{
							"type": "text",
							"text": string(p),
						}
						jsonData, _ := json.Marshal(chunk)
						fmt.Fprintf(w, "data: %s\n\n", jsonData)
						flusher.Flush()
					case genai.FunctionCall:
						// Handle tool calls
						toolResult := fmt.Sprintf("Tool: %s, Args: %v", p.Name, p.Args)
						toolResults = append(toolResults, toolResult)
					}
				}
			}

		}
	}

	// Send sources and tool results at the end
	if len(sources) > 0 || len(toolResults) > 0 {
		endData := map[string]interface{}{
			"type":        "metadata",
			"sources":     sources,
			"toolResults": toolResults,
		}
		jsonData, _ := json.Marshal(endData)
		fmt.Fprintf(w, "data: %s\n\n", jsonData)
		flusher.Flush()
	}

	// Send done signal
	fmt.Fprintf(w, "data: {\"type\": \"done\"}\n\n")
	flusher.Flush()
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status": "healthy",
		"model":  "gemini-3-flash-preview",
	})
}

func main() {
	// Initialize Gemini
	if err := initGemini(); err != nil {
		log.Fatalf("Failed to initialize Gemini: %v", err)
	}
	defer client.Close()

	// Set up router
	r := mux.NewRouter()

	// API routes
	r.HandleFunc("/api/chat", chatHandler).Methods("POST", "OPTIONS")
	r.HandleFunc("/api/health", healthHandler).Methods("GET")

	// CORS configuration
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "https://*.vercel.app"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	handler := c.Handler(r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("CarBot Go backend starting on port %s...", port)
	log.Printf("Model: Gemini 3 Flash Preview")

	if err := http.ListenAndServe(":"+port, handler); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
