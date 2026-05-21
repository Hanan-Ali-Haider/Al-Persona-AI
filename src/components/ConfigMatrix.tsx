import React from "react";
import { Sliders, EnergyMode } from "../types";
import { Gauge, HelpCircle, Activity } from "lucide-react";

interface ConfigMatrixProps {
  sliders: Sliders;
  onChangeSliders: (newSliders: Sliders) => void;
}

export default function ConfigMatrix({ sliders, onChangeSliders }: ConfigMatrixProps) {
  const updateSlider = (key: keyof Sliders, value: number | string) => {
    onChangeSliders({
      ...sliders,
      [key]: value,
    });
  };

  const getEmotionalLabel = (val: number) => {
    if (val < 25) return "Logical & factual (low emotion)";
    if (val < 50) return "Calm & objective listening";
    if (val < 75) return "Empathetic & supportive";
    return "Very warm & deeply caring";
  };

  const getAnalyticalLabel = (val: number) => {
    if (val < 25) return "Short & conversational";
    if (val < 50) return "Balanced explanations";
    if (val < 75) return "Detailed & structured";
    return "Highly detailed academic analysis";
  };

  const getHumorLabel = (val: number) => {
    if (val < 25) return "Serious & literal tone";
    if (val < 50) return "Dry & occasional wit";
    if (val < 75) return "Witty & playful banter";
    return "Highly sarcastic & witty";
  };

  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-5 space-y-6" id="config-matrix-container">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3" id="config-matrix-header">
        <div className="flex items-center gap-2" id="cognitive-matrix-title">
          <Gauge className="w-5 h-5 text-indigo-400" id="icon-gauge" />
          <h3 className="font-display font-semibold text-base text-slate-100">
            Customize Personality
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-indigo-300 bg-indigo-950/40 border border-indigo-900/40 px-2.5 py-1 rounded-full" id="real-time-tuning">
          <Activity className="w-3.5 h-3.5 text-indigo-400" id="tuning-pulse" />
          <span className="font-mono">Tuning Active</span>
        </div>
      </div>

      <div className="space-y-5" id="sliders-wrap">
        {/* Slider 1: Emotional Range */}
        <div className="space-y-2" id="slider-emotional-container">
          <div className="flex justify-between text-xs" id="slider-emotional-header">
            <span className="text-slate-300 font-medium flex items-center gap-1.5" id="label-emotional">
              Emotion & Empathy
            </span>
            <span className="font-mono text-indigo-400 font-semibold" id="val-emotional">
              {sliders.emotionalRange}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={sliders.emotionalRange}
            onChange={(e) => updateSlider("emotionalRange", parseInt(e.target.value))}
            className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            id="input-slider-emotional"
          />
          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between" id="emotional-meta">
            <span id="label-desc-emotional">{getEmotionalLabel(sliders.emotionalRange)}</span>
          </div>
        </div>

        {/* Slider 2: Analytical Complexity */}
        <div className="space-y-2" id="slider-analytical-container">
          <div className="flex justify-between text-xs" id="slider-analytical-header">
            <span className="text-slate-300 font-medium flex items-center gap-1.5" id="label-analytical">
              Analytical Depth
            </span>
            <span className="font-mono text-emerald-400 font-semibold" id="val-analytical">
              {sliders.analyticalDepth}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={sliders.analyticalDepth}
            onChange={(e) => updateSlider("analyticalDepth", parseInt(e.target.value))}
            className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            id="input-slider-analytical"
          />
          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between" id="analytical-meta">
            <span id="label-desc-analytical">{getAnalyticalLabel(sliders.analyticalDepth)}</span>
          </div>
        </div>

        {/* Slider 3: Humor & Sarcasm */}
        <div className="space-y-2" id="slider-humor-container">
          <div className="flex justify-between text-xs" id="slider-humor-header">
            <span className="text-slate-300 font-medium flex items-center gap-1.5" id="label-humor">
              Humor & Wit
            </span>
            <span className="font-mono text-amber-400 font-semibold" id="val-humor">
              {sliders.humorWit}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={sliders.humorWit}
            onChange={(e) => updateSlider("humorWit", parseInt(e.target.value))}
            className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            id="input-slider-humor"
          />
          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between" id="humor-meta">
            <span id="label-desc-humor">{getHumorLabel(sliders.humorWit)}</span>
          </div>
        </div>

        {/* Mode Selector Toggle */}
        <div className="pt-2" id="energy-mode-container">
          <span className="block text-xs text-slate-300 font-medium mb-2" id="label-energy">
            Conversation Tone
          </span>
          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800/80" id="cadence-wrap">
            <button
              onClick={() => updateSlider("energyMode", "casual")}
              className={`py-1.5 px-3 rounded text-xs font-medium transition-all ${
                sliders.energyMode === "casual"
                  ? "bg-slate-800 text-slate-100 font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              id="btn-cadence-casual"
            >
              Casual
            </button>
            <button
              onClick={() => updateSlider("energyMode", "professional")}
              className={`py-1.5 px-3 rounded text-xs font-medium transition-all ${
                sliders.energyMode === "professional"
                  ? "bg-slate-800 text-slate-100 font-semibold shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              id="btn-cadence-professional"
            >
              Professional
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
