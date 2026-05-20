import React from "react";
import { Message } from "../types";
import { Scale, Heart, Sparkles, Cpu, Clock, Terminal } from "lucide-react";

interface CognitiveDashboardProps {
  messages: Message[];
}

export default function CognitiveDashboard({ messages }: CognitiveDashboardProps) {
  // Extract latest message metrics or find averages
  const assistantMessages = messages.filter((m) => m.role === "assistant");
  const latestMessage = assistantMessages[assistantMessages.length - 1];

  const metrics = latestMessage?.metrics || {
    latencyMs: 0,
    wordCount: 0,
    sentimentScore: 0,
    complexityScore: 0,
    humorLevel: 0,
  };

  const getSentimentGlow = (score: number) => {
    if (score > 0.3) return "text-rose-400 bg-rose-950/30 border-rose-900/40";
    if (score < -0.1) return "text-indigo-400 bg-indigo-950/30 border-indigo-900/40";
    return "text-slate-400 bg-slate-800/40 border-slate-700/30";
  };

  const getSentimentLabel = (score: number) => {
    if (score > 0.3) return "Warm & Empathetic";
    if (score < -0.1) return "Structured & Objective";
    return "Balanced / Neutral";
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 space-y-5" id="cognitive-dashboard-container">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3" id="cognitive-dashboard-header">
        <div className="flex items-center gap-2" id="cognitive-dashboard-title">
          <Terminal className="w-5 h-5 text-emerald-400" id="icon-terminal" />
          <h3 className="font-display font-semibold text-base text-slate-100">
            Message Style Analysis
          </h3>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400/80 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/40" id="live-telemetry">
          Live Stats
        </span>
      </div>

      {assistantMessages.length === 0 ? (
        <div className="py-6 text-center text-slate-500 text-xs space-y-2" id="dashboard-empty">
          <p id="dashboard-empty-text">Waiting for messages...</p>
          <p className="text-[11px] text-slate-600 font-mono" id="dashboard-empty-subtext">Send a message to view tone stats</p>
        </div>
      ) : (
        <div className="space-y-4" id="dashboard-metrics-wrap">
          {/* Sentiment Gauge */}
          <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/60" id="gauge-sentiment">
            <div className="flex justify-between items-center mb-1.5" id="gauge-sentiment-head">
              <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5" id="label-sentiment">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                Empathy & Warmth
              </span>
              <span className="text-xs font-mono font-medium text-slate-400" id="val-sentiment-score">
                {metrics.sentimentScore > 0 ? `+${metrics.sentimentScore}` : metrics.sentimentScore}
              </span>
            </div>
            {/* Sentiment Meter Bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex" id="bar-sentiment">
              {/* Negative portion left and positive portion right */}
              <div 
                className={`h-full transition-all duration-500 ${
                  metrics.sentimentScore < 0 
                  ? "bg-indigo-500 ml-auto" 
                  : "bg-rose-500 mr-auto"
                }`}
                style={{ width: `${Math.abs(metrics.sentimentScore) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-[10px] text-slate-400" id="sentiment-foot">
              <span id="label-cold-extreme">Logical (-1.0)</span>
              <span className={`px-1.5 py-0.2 rounded border text-[10px] font-mono leading-none ${getSentimentGlow(metrics.sentimentScore)}`} id="sentiment-status">
                {getSentimentLabel(metrics.sentimentScore)}
              </span>
              <span id="label-warm-extreme">Warm (+1.0)</span>
            </div>
          </div>

          {/* Key metrics grid */}
          <div className="grid grid-cols-2 gap-3" id="metrics-grid">
            {/* Complexity Score Block */}
            <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/60" id="gauge-complexity">
              <div className="flex justify-between items-center mb-1" id="gauge-complexity-head">
                <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5" id="label-complexity">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  Sentence Complexity
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400" id="val-complexity-score">
                  {metrics.complexityScore}%
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden" id="bar-complexity">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500" 
                  style={{ width: `${metrics.complexityScore}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 block mt-1" id="complexity-label">
                {metrics.complexityScore < 35 
                  ? "Simple & clear" 
                  : metrics.complexityScore < 70 
                    ? "Moderate detail" 
                    : "Sophisticated / Detailed"}
              </span>
            </div>

            {/* Humor Level Block */}
            <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/60" id="gauge-humor">
              <div className="flex justify-between items-center mb-1" id="gauge-humor-head">
                <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5" id="label-humor-index">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Humor Level
                </span>
                <span className="text-xs font-mono font-bold text-amber-400" id="val-humor-score">
                  {metrics.humorLevel}%
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden" id="bar-humor">
                <div 
                  className="bg-amber-400 h-full transition-all duration-500" 
                  style={{ width: `${metrics.humorLevel}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 block mt-1" id="humor-label">
                {metrics.humorLevel < 30 
                  ? "Serious & literal" 
                  : metrics.humorLevel < 65 
                    ? "Lighthearted" 
                    : "Witty & sarcastic"}
              </span>
            </div>
          </div>

          {/* Temporal Metrics Foot */}
          <div className="pt-2 border-t border-slate-800/50 flex justify-between items-center text-xs text-slate-400 font-mono" id="temporal-metrics">
            <div className="flex items-center gap-1.5" id="latency-metric">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Response time:</span>
              <span className="text-slate-200 font-semibold">{metrics.latencyMs}ms</span>
            </div>
            <div id="word-metric">
              <span>Word count:</span>
              <span className="text-slate-200 font-semibold ml-1">{metrics.wordCount}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
