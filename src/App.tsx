import React, { useState, useEffect } from "react";
import { Message, Sliders, PersonaPreset } from "./types";
import { PERSONA_PRESETS } from "./data";
import { calculateTextMetrics } from "./utils";
import PersonaSelector from "./components/PersonaSelector";
import ConfigMatrix from "./components/ConfigMatrix";
import CognitiveDashboard from "./components/CognitiveDashboard";
import ChatInterface from "./components/ChatInterface";
import WelcomeScreen from "./components/WelcomeScreen";
import { Sparkles, Key, ExternalLink, HelpCircle, Shield, Code, ChevronRight } from "lucide-react";

export default function App() {
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem("persona_lab_user_name") || "";
  });

  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(() => {
    return localStorage.getItem("persona_lab_onboarding_complete") === "true";
  });

  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    return localStorage.getItem("persona_lab_onboarding_complete") !== "true";
  });

  const [activeTab, setActiveTab] = useState<"chat" | "tuning">("chat");
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize messages from localStorage if available
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem("persona_lab_messages");
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }));
      }
    } catch (e) {
      console.error("Could not parse saved messages:", e);
    }
    return [];
  });

  const [selectedPresetId, setSelectedPresetId] = useState<string>(() => {
    return localStorage.getItem("persona_lab_selected_preset_id") || "anchor";
  });

  // Initialize sliders with the "Empathetic Anchor" values or saved settings
  const [sliders, setSliders] = useState<Sliders>(() => {
    try {
      const saved = localStorage.getItem("persona_lab_sliders");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Could not parse saved sliders:", e);
    }
    return {
      basePersona: "Empathetic Anchor",
      emotionalRange: 90,
      analyticalDepth: 40,
      humorWit: 50,
      energyMode: "casual",
    };
  });

  const [apiHealth, setApiHealth] = useState({
    hasKey: false,
    initialized: false,
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("persona_lab_user_name", userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem("persona_lab_onboarding_complete", onboardingComplete ? "true" : "false");
  }, [onboardingComplete]);

  useEffect(() => {
    localStorage.setItem("persona_lab_messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("persona_lab_sliders", JSON.stringify(sliders));
  }, [sliders]);

  useEffect(() => {
    localStorage.setItem("persona_lab_selected_preset_id", selectedPresetId);
  }, [selectedPresetId]);

  // Fetch server config on active mount
  useEffect(() => {
    async function checkConfig() {
      try {
        const res = await fetch("/api/config");
        if (res.ok) {
          const config = await res.json();
          setApiHealth({
            hasKey: config.hasKey,
            initialized: true,
          });
        }
      } catch (err) {
        console.error("Could not fetch server config:", err);
        setApiHealth({
          hasKey: false,
          initialized: true,
        });
      }
    }
    checkConfig();
  }, []);

  // Update layout sliders when user switches presets
  const handleSelectPreset = (preset: PersonaPreset) => {
    setSelectedPresetId(preset.id);
    setSliders(preset.sliders);
  };

  // Triggered when sliders are manually tweaked - allows custom personas
  const handleChangeSliders = (newSliders: Sliders) => {
    setSelectedPresetId("custom");
    setSliders({
      ...newSliders,
      basePersona: "Custom Persona",
    });
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!customText) setInputValue("");
    setIsLoading(true);

    const startTime = performance.now();

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          sliders,
          userName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to parse API response stream");
      }

      const data = await response.json();
      const endTime = performance.now();
      const latencyMs = Math.round(endTime - startTime);

      // Perform genuine on-the-fly natural language analytics on the response
      const metrics = calculateTextMetrics(data.reply, latencyMs);

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply,
        timestamp: new Date(),
        metrics,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error: any) {
      console.error("Error communicating with full-stack proxy:", error);
      
      const latencyMs = Math.round(performance.now() - startTime);
      const simulatedErrorText = `**Unable to Connect**\n\nI could not get a response from the AI model. 
 
* **Reason**: ${error.message || "Network issue or key not set."}
* **Fix**: If your API key is missing, please set your **GEMINI_API_KEY** in the **Settings** menu.
 
Let me know if you want to try again.`;

      const errMetrics = calculateTextMetrics(simulatedErrorText, latencyMs);

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: simulatedErrorText,
        timestamp: new Date(),
        metrics: errMetrics,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setInputValue("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200" id="main-app-container">
      {/* Absolute top grid line/glow to establish visually rich background */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-radial from-indigo-950/20 via-transparent to-transparent pointer-events-none" />

      {/* Main Header Bar - Humble, highly crafted design without tech-larping */}
      <header className="relative z-10 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md px-6 py-4" id="app-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between" id="header-inner">
          <div className="flex items-center gap-3" id="header-brand">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-display font-bold text-lg shadow-sm" id="brand-badge">
              Ψ
            </div>
            <div>
              <h1 className="font-display font-semibold text-base text-slate-100 tracking-tight leading-tight" id="app-title">
                AI Persona Lab
              </h1>
              <span className="text-xs font-mono text-slate-500 block leading-none mt-1" id="app-subtitle">
                Personality Style Center {userName ? `• Welcome, ${userName}` : ""}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3" id="header-controls">
            {userName && onboardingComplete && (
              <button
                onClick={() => setShowWelcome(true)}
                className="text-xs text-slate-350 hover:text-slate-100 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                id="header-btn-welcome"
              >
                <span>👤 Name: {userName}</span>
              </button>
            )}
            <div className="flex items-center gap-2 text-xs bg-slate-900 border border-slate-800/80 px-3 py-1.5 rounded-lg font-mono text-slate-350" id="api-status-shield">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" id="shield-icon" />
              <span>AI Persona Lab</span>
            </div>
          </div>
        </div>
      </header>

      {/* Primary Layout Area */}
      <main className="flex-1 relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-8 flex flex-col gap-5 sm:gap-6" id="app-main-layout">
        {/* Mobile View Tab Switcher Only */}
        <div className="lg:hidden grid grid-cols-2 bg-slate-900 border border-slate-850 p-1 rounded-lg gap-1 shadow-md" id="mobile-tab-bar">
          <button
            onClick={() => setActiveTab("chat")}
            className={`py-2 px-3 rounded font-medium text-xs font-display flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "chat"
                ? "bg-slate-800 text-slate-100 shadow-sm font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            💬 Chat Interface
          </button>
          <button
            onClick={() => setActiveTab("tuning")}
            className={`py-2 px-3 rounded font-medium text-xs font-display flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "tuning"
                ? "bg-slate-800 text-slate-100 shadow-sm font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            ⚙️ Tweak Personality
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="app-main-grid">
          {/* Left Side: Cognitive Configurations Panel */}
          <section className={`space-y-6 flex flex-col justify-start lg:col-span-5 ${activeTab === "tuning" ? "block" : "hidden lg:flex"}`} id="config-panel">
            {/* Section Heading */}
            <div className="space-y-1.5" id="config-intro">
              <div className="flex items-center gap-1 text-xs text-indigo-400 font-mono font-semibold uppercase tracking-wider" id="meta-banner">
                <span>Settings</span>
                <ChevronRight className="w-3 h-3" />
                <span>Personality</span>
              </div>
              <h2 className="font-display font-semibold text-xl text-slate-100 tracking-tight" id="config-headline">
                Customize AI Personality
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed" id="config-summary">
                Select a personality preset or tweak individual sliders to customize how the AI responds.
              </p>
            </div>

            {/* Preset Cards Select */}
            <PersonaSelector
              selectedPresetId={selectedPresetId}
              onSelectPreset={handleSelectPreset}
            />

            {/* Cognitive Sliders Matrix */}
            <ConfigMatrix
              sliders={sliders}
              onChangeSliders={handleChangeSliders}
            />

            {/* Linguistic Diagnostics Panel */}
            <CognitiveDashboard
              messages={messages}
            />
          </section>

          {/* Right Side: Conversation thread viewport */}
          <section className={`flex flex-col h-full lg:col-span-7 ${activeTab === "chat" ? "block" : "hidden lg:flex"}`} id="workspace-panel">
            <ChatInterface
              messages={messages}
              inputValue={inputValue}
              setInputValue={setInputValue}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              onClearChat={handleClearChat}
              sliders={sliders}
              apiHealth={apiHealth}
            />
          </section>
        </div>
      </main>

      {/* Master Compact Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-5 text-center text-xs text-slate-500 font-mono relative z-10" id="app-footer">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3" id="footer-inner">
          <span id="copyright-notice">AI Persona Lab — Created by Hanan Ali Haider</span>
          <div className="flex items-center gap-4 text-slate-400" id="footer-links">
            <span className="flex items-center gap-1" id="footer-token">
              <Code className="w-3.5 h-3.5" />
              <span>Empowered by Gemini</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Welcome Screen / Onboarding Modal */}
      {showWelcome && (
        <WelcomeScreen
          userName={userName}
          setUserName={setUserName}
          onboardingComplete={onboardingComplete}
          messageCount={messages.length}
          sliders={sliders}
          onComplete={() => {
            setOnboardingComplete(true);
            setShowWelcome(false);
          }}
        />
      )}
    </div>
  );
}
