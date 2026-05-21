import React, { useRef, useEffect } from "react";
import { Message, Sliders } from "../types";
import { STARTER_PROMPTS } from "../data";
import { Send, Clock, Sparkles, AlertCircle, RefreshCw, Terminal } from "lucide-react";

interface ChatInterfaceProps {
  messages: Message[];
  inputValue: string;
  setInputValue: (val: string) => void;
  isLoading: boolean;
  onSendMessage: (text?: string) => void;
  onClearChat: () => void;
  sliders: Sliders;
  apiHealth: { hasKey: boolean; initialized: boolean };
}

export default function ChatInterface({
  messages,
  inputValue,
  setInputValue,
  isLoading,
  onSendMessage,
  onClearChat,
  sliders,
  apiHealth,
}: ChatInterfaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // A light, high-performance, and secure custom Markdown renderer that handles
  // paragraphs, bold text (**text**), lists, and code blocks (`code` or ```code```) beautifully!
  const formatMarkdown = (text: string) => {
    if (!text) return null;

    // Split by code blocks ```
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      // Code Block
      if (part.startsWith("```") && part.endsWith("```")) {
        const lines = part.slice(3, -3).trim().split("\n");
        let language = "text";
        let codeLines = lines;

        if (lines.length > 0 && /^[a-zA-Z0-9#+-_]+$/.test(lines[0])) {
          language = lines[0];
          codeLines = lines.slice(1);
        }

        return (
          <div key={index} className="my-3 overflow-hidden rounded-lg border border-slate-800 bg-slate-950 font-mono text-xs text-slate-300 shadow-inner" id={`code-block-${index}`}>
            <div className="bg-slate-900 px-4 py-1.5 flex justify-between items-center text-[10px] text-slate-400 border-b border-slate-800" id={`code-header-${index}`}>
              <div className="flex items-center gap-1.5 font-semibold">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                <span>{language.toUpperCase()}</span>
              </div>
              <span>source readout</span>
            </div>
            <pre className="p-4 overflow-x-auto whitespace-pre leading-relaxed" id={`code-content-${index}`}>
              <code>{codeLines.join("\n")}</code>
            </pre>
          </div>
        );
      }

      // Normal text blocks with line breaks, bold elements, and custom formatted bullet items
      const paragraphs = part.split("\n\n");
      return paragraphs.map((para, pIndex) => {
        const trimmed = para.trim();
        if (!trimmed) return null;

        // Custom Bullet item check
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const listItems = trimmed.split(/\n[-*]\s+/);
          return (
            <ul key={`${index}-${pIndex}`} className="list-disc pl-5 my-2.5 space-y-1.5 text-sm text-slate-300 leading-relaxed" id={`list-${index}-${pIndex}`}>
              {listItems.map((item, iIndex) => {
                const itemContent = item.replace(/^[-*]\s+/, "");
                return (
                  <li key={iIndex} id={`list-item-${index}-${pIndex}-${iIndex}`}>
                    {renderInlineBold(itemContent)}
                  </li>
                );
              })}
            </ul>
          );
        }

        // Standard Paragraph
        return (
          <p key={`${index}-${pIndex}`} className="text-sm text-slate-300 leading-relaxed my-2" id={`p-${index}-${pIndex}`}>
            {renderInlineBold(trimmed)}
          </p>
        );
      });
    });
  };

  // Turn **bold** segments into JSX elements safely
  const renderInlineBold = (text: string) => {
    const boldParts = text.split(/(\*\*.*?\*\*)/g);
    return boldParts.map((boldPart, idx) => {
      if (boldPart.startsWith("**") && boldPart.endsWith("**")) {
        return (
          <strong key={idx} className="font-bold text-slate-100 bg-slate-800/40 px-1 rounded" id={`bold-${idx}`}>
            {boldPart.slice(2, -2)}
          </strong>
        );
      }
      return boldPart;
    });
  };

  const getPresetAvatar = (presetName: string) => {
    switch (presetName.toLowerCase()) {
      case "empathetic anchor":
        return "🌸";
      case "analytical mind":
        return "🧠";
      case "creative spark":
        return "⚡";
      case "brutalist philosopher":
        return "⚖️";
      default:
        return "🔋";
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-slate-900 border border-slate-800/80 rounded-xl overflow-hidden shadow-xl shadow-slate-950/20" id="chat-interface-wrap">
      {/* Thread header bar */}
      <div className="px-5 py-4 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between" id="chat-header-bar">
        <div className="flex items-center gap-2.5" id="chat-session-badge">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" id="live-chat-pulse" />
          <div>
            <span className="font-display font-medium text-xs text-slate-400 block" id="thread-state">Current Chat</span>
            <span className="text-sm font-semibold text-slate-200" id="thread-preset-name">{sliders.basePersona}</span>
          </div>
        </div>
        <button
          onClick={onClearChat}
          disabled={messages.length === 0}
          className="text-xs font-mono text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-850 px-3 py-1.5 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed clickable"
          id="btn-clear-chat"
        >
          Reset Context
        </button>
      </div>

      {/* Messages Scroll viewport */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-950/20" id="messages-viewport">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-between" id="chat-welcome-block">
            {/* API Warning/Status Banner */}
            {!apiHealth.hasKey && apiHealth.initialized && (
              <div className="p-4 bg-amber-950/20 border border-amber-900/40 rounded-xl text-xs text-amber-300 flex gap-3 leading-relaxed items-start" id="api-warning-banner">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" id="alert-icon" />
                <div className="space-y-1" id="alert-body">
                  <span className="font-semibold block text-amber-200" id="alert-title">API Key (GEMINI_API_KEY) Not Configured</span>
                  <p id="alert-para">
                    Your Gemini API key is missing. Please configure your key in the **Settings &gt; Secrets** panel in the top-right options of the AI Studio window to make live AI calls.
                  </p>
                </div>
              </div>
            )}

            <div className="text-center my-auto max-w-sm mx-auto space-y-3 py-6" id="welcome-intro">
              <span className="text-4xl block animate-bounce" id="welcome-emoji">🛸</span>
              <h4 className="font-display font-semibold text-base text-slate-200" id="welcome-title">
                AI Persona Lab
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed" id="welcome-desc">
                Chat with different AI personalities. You can choose a preset or move the sliders on the left to customize the AI's response style.
              </p>
            </div>

            {/* Quick Starters Bento */}
            <div className="space-y-2.5 pt-4" id="starters-container">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block" id="starters-label">
                Choose a prompt to start:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" id="starters-grid">
                {STARTER_PROMPTS.map((prompt, index) => (
                  <button
                    key={index}
                    id={`starter-btn-${index}`}
                    onClick={() => onSendMessage(prompt.text)}
                    disabled={isLoading}
                    className="flex text-left p-3 rounded-lg border border-slate-800/60 bg-slate-900/40 hover:bg-slate-800/40 hover:border-slate-700/60 transition-all text-xs text-slate-300 items-center gap-3 active:scale-[0.99] group cursor-pointer"
                  >
                    <span className="bg-slate-800 p-1.5 rounded-md group-hover:scale-115 transition-transform" id={`starter-pref-${index}`}>
                      ✨
                    </span>
                    <span className="font-medium text-slate-200 font-display text-xs" id={`starter-label-${index}`}>
                      {prompt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4" id="message-list-wrap">
            {messages.map((message) => {
              const isAssistant = message.role === "assistant";
              return (
                <div
                  key={message.id}
                  id={`msg-node-${message.id}`}
                  className={`flex gap-3 max-w-[85%] ${isAssistant ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                >
                  {/* Persona Avatar Icons */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm border flex-shrink-0 ${
                      isAssistant ? "bg-slate-900 border-slate-750" : "bg-indigo-950/50 border-indigo-900/40 text-indigo-400"
                    }`}
                    id={`avatar-indicator-${message.id}`}
                  >
                    {isAssistant ? getPresetAvatar(sliders.basePersona) : "👤"}
                  </div>

                  <div className="space-y-1.5" id={`message-core-${message.id}`}>
                    <div
                      className={`p-4 rounded-xl text-slate-250 leading-relaxed shadow-sm ${
                        isAssistant
                          ? "bg-slate-900/70 border border-slate-800/80 rounded-tl-none font-sans"
                          : "bg-indigo-800/20 border border-indigo-900/30 text-indigo-100 rounded-tr-none font-sans"
                      }`}
                      id={`message-bubble-${message.id}`}
                    >
                      {isAssistant ? (
                        formatMarkdown(message.content)
                      ) : (
                        <p className="text-sm" id={`user-text-${message.id}`}>{message.content}</p>
                      )}
                    </div>
                    {/* Timestamp & stats readout line */}
                    <div
                      className={`flex gap-2 text-[10px] font-mono text-slate-500 items-center ${
                        isAssistant ? "justify-start" : "justify-end"
                      }`}
                      id={`message-meta-${message.id}`}
                    >
                      <span id={`time-${message.id}`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </span>
                      {isAssistant && message.metrics && (
                        <>
                          <span>•</span>
                          <span className="text-indigo-400" id={`score-${message.id}`}>
                            S: {message.metrics.sentimentScore} | C: {message.metrics.complexityScore}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Simulated/Real Active Typing State */}
            {isLoading && (
              <div className="flex gap-3 max-w-[80%] mr-auto" id="loading-node">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-900 border border-slate-750 text-sm flex-shrink-0" id="loading-avatar">
                  {getPresetAvatar(sliders.basePersona)}
                </div>
                <div className="space-y-1" id="loading-core">
                  <div className="p-4 bg-slate-900/70 border border-slate-800/80 rounded-xl rounded-tl-none" id="loading-bubble">
                    <div className="flex items-center gap-2 text-slate-400 text-xs" id="typing-container">
                      <div className="flex space-x-1" id="dots-container">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} id="dot-1" />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} id="dot-2" />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} id="dot-3" />
                      </div>
                      <span className="font-mono text-[11px] ml-1.5" id="typing-notification">AI is writing...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollRef} id="scroll-anchor" />
          </div>
        )}
      </div>

      {/* Input panel block */}
      <div className="p-4 bg-slate-950 border-t border-slate-800/80" id="input-control-panel">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSendMessage();
          }}
          className="flex gap-2"
          id="chat-form"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            placeholder={
              !apiHealth.hasKey
                ? "Configure GEMINI_API_KEY in Settings to start..."
                : `Message ${sliders.basePersona}...`
            }
            className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-sm placeholder:text-slate-500 focus:outline-none focus:border-slate-700 focus:ring-1 focus:ring-slate-700 text-slate-100 disabled:opacity-50"
            id="chat-input-text-field"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim() || !apiHealth.hasKey}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-250 font-medium transition-colors disabled:opacity-40 disabled:hover:bg-slate-800 disabled:cursor-not-allowed flex items-center justify-center"
            id="chat-submit-btn"
          >
            <Send className="w-4 h-4" id="icon-send" />
          </button>
        </form>
      </div>
    </div>
  );
}
