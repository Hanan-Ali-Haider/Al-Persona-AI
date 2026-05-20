import React, { useState } from "react";
import { Sparkles, User, ArrowRight, BookOpen, Clock, Heart } from "lucide-react";
import { Sliders } from "../types";

interface WelcomeScreenProps {
  userName: string;
  setUserName: (name: string) => void;
  onComplete: () => void;
  onboardingComplete: boolean;
  messageCount: number;
  sliders: Sliders;
}

export default function WelcomeScreen({
  userName,
  setUserName,
  onComplete,
  onboardingComplete,
  messageCount,
  sliders,
}: WelcomeScreenProps) {
  const [tempName, setTempName] = useState(userName || "");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempName.trim()) {
      setError("Please enters a name to personalize your assistant.");
      return;
    }
    setUserName(tempName.trim());
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md px-4" id="welcome-modal-overlay">
      {/* Dynamic faint radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl w-full max-w-md p-6 sm:p-8 relative z-10 shadow-2xl space-y-6" id="welcome-modal-card">
        <div className="text-center space-y-2.5" id="welcome-modal-header">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-display font-bold text-xl mx-auto shadow-sm" id="welcome-modal-logo">
            Ψ
          </div>
          <h2 className="font-display font-semibold text-2xl text-slate-100 tracking-tight" id="welcome-modal-title">
            {onboardingComplete ? "Welcome Back!" : "AI Persona Lab"}
          </h2>
          <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed" id="welcome-modal-subtitle">
            {onboardingComplete 
              ? "Hop right back in! Your messages, custom settings, and workspace preferences are saved." 
              : "Discover and customize adaptive AI personalities designed to naturally match your communication style."}
          </p>
        </div>

        {onboardingComplete ? (
          /* Welcome Back Flow */
          <div className="space-y-5" id="welcome-back-flow">
            <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/80 space-y-3 text-xs leading-relaxed text-slate-350" id="welcome-back-summary">
              <span className="font-semibold text-[10px] font-mono text-indigo-400 block uppercase tracking-wider" id="state-saved-label">Saved Dialogue State</span>
              <div className="grid grid-cols-2 gap-3" id="saved-stats-grid">
                <div className="space-y-1" id="saved-stat-owner">
                  <span className="text-slate-500 block">User Account:</span>
                  <span className="text-slate-200 font-semibold text-sm flex items-center gap-1.5" id="display-saved-user-name">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {userName}
                  </span>
                </div>
                <div className="space-y-1" id="saved-stat-history">
                  <span className="text-slate-500 block">Previous messages:</span>
                  <span className="text-slate-200 font-semibold text-sm" id="display-saved-messages">
                    {messageCount} message{messageCount !== 1 && "s"} Saved
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800/50 space-y-1" id="saved-stat-personality">
                <span className="text-slate-500 block">Current AI Tuning Profile:</span>
                <span className="text-slate-200 font-medium" id="display-saved-persona">
                  {sliders.basePersona} ({sliders.energyMode === "casual" ? "Casual" : "Professional"} dialect)
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5" id="welcome-back-actions">
              <button
                type="button"
                onClick={() => {
                  // Allow altering user details
                  setTempName(userName);
                  setError("");
                  // Temporarily disable overlay flag state logic
                  const onboardingKey = "persona_lab_onboarding_complete";
                  localStorage.removeItem(onboardingKey);
                  window.location.reload();
                }}
                className="flex-1 py-2.5 px-4 text-xs font-medium text-slate-300 hover:text-slate-100 bg-slate-800/40 hover:bg-slate-800 border border-slate-850 rounded-xl transition-all"
                id="btn-edit-details"
              >
                Change Name
              </button>
              <button
                type="button"
                onClick={onComplete}
                className="flex-[2] py-2.5 px-4 text-xs font-semibold text-slate-950 bg-indigo-400 hover:bg-indigo-350 rounded-xl transition-all shadow-md shadow-indigo-950/20 flex items-center justify-center gap-2 cursor-pointer"
                id="btn-continue-chat"
              >
                <span>Continue Your Chatting</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Get Started Flow */
          <form onSubmit={handleSubmit} className="space-y-4" id="welcome-form">
            <div className="space-y-2" id="input-field-container">
              <label htmlFor="user-name" className="text-xs text-slate-300 font-medium flex items-center gap-1.5" id="label-user-name">
                <User className="w-4 h-4 text-slate-400" />
                What is your name?
              </label>
              <input
                type="text"
                id="user-name"
                value={tempName}
                onChange={(e) => {
                  setTempName(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter your name..."
                maxLength={40}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm placeholder:text-slate-500 focus:outline-none focus:border-slate-700 focus:ring-1 focus:ring-slate-700 text-slate-100"
              />
              {error && <p className="text-xs text-rose-400 font-medium pt-1" id="input-error-msg">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-semibold text-slate-950 bg-indigo-400 hover:bg-indigo-350 rounded-xl transition-all shadow-md shadow-indigo-950/20 flex items-center justify-center gap-2 cursor-pointer"
              id="submit-get-started"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
