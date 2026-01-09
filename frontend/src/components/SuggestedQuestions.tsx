"use client";

import { Zap, Search, Car, DollarSign } from "lucide-react";

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
}

const suggestions = [
  {
    icon: Car,
    question: "What are the best sports cars under $50k?",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Search,
    question: "Compare the BMW M3 vs Mercedes C63 AMG",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: Zap,
    question: "What's the fastest electric car in 2025?",
    color: "from-green-500 to-green-600",
  },
  {
    icon: DollarSign,
    question: "Most reliable used cars for first-time buyers",
    color: "from-purple-500 to-purple-600",
  },
];

export function SuggestedQuestions({ onSelectQuestion }: SuggestedQuestionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
      {suggestions.map((suggestion, index) => {
        const Icon = suggestion.icon;
        return (
          <button
            key={index}
            onClick={() => onSelectQuestion(suggestion.question)}
            className="flex items-center gap-3 p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-xl text-left transition-all group"
          >
            <div
              className={`p-2 rounded-lg bg-gradient-to-br ${suggestion.color} group-hover:scale-110 transition-transform`}
            >
              <Icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
              {suggestion.question}
            </span>
          </button>
        );
      })}
    </div>
  );
}
