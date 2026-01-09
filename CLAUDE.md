# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CarBot is a car enthusiast chatbot powered by Google Vertex AI's ChatBison LLM. It provides car advice, recommendations, and answers to automotive questions through either a GUI or command-line interface.

## Running the Application

```bash
# Run the GUI application
python chatGUI.py
```

## Dependencies

Install required packages:
```bash
pip install vertexai google-cloud-aiplatform pysimplegui colorama termcolor
```

## Docker

```bash
# Build and run (runs main.py, which is a template - use chatGUI.py for the actual app)
docker build -t carbot .
docker run -p 80:80 carbot
```

## Architecture

- **chatBot.py** - Core chatbot logic. Initializes Vertex AI with the ChatBison model and handles message sending. The `initChatBot()` function creates a chat session with car enthusiast context, and `get_response()` sends user messages to the model.

- **chatGUI.py** - PySimpleGUI-based interface. Provides a window with chat output, input field, and Send/Clear/Exit buttons. This is the main entry point for users.

- **main.py** - Placeholder/template file (not the main application).

## Google Cloud Configuration

The chatbot requires Google Cloud authentication and uses:
- Project: `lexical-list-320222`
- Region: `us-central1`
- Model: `chat-bison`

Ensure Google Cloud credentials are configured (via `gcloud auth` or service account).
