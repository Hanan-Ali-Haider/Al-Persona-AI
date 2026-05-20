import React from "react";
import { Heart, Cpu, Sparkles, Compass } from "lucide-react";
import { PersonaPreset } from "../types";
import { PERSONA_PRESETS } from "../data";

interface PersonaSelectorProps {
  selectedPresetId: string;
  onSelectPreset: (preset: PersonaPreset) => void;
}

export default function PersonaSelector({
  selectedPresetId,
  onSelectPreset,
}: PersonaSelectorProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Heart":
        return <Heart className="w-5 h-5 text-rose-400" id="icon-heart" />;
      case "Cpu":
        return <Cpu className="w-5 h-5 text-emerald-400" id="icon-cpu" />;
      case "Sparkles":
        return <Sparkles className="w-5 h-5 text-amber-400" id="icon-sparkles" />;
      case "Compass":
        return <Compass className="w-5 h-5 text-indigo-400" id="icon-compass" />;
      default:
        return <Sparkles className="w-5 h-5 text-slate-400" id="icon-default" />;
    }
  };

  return (
    <div className="space-y-4" id="persona-selector-container">
      <div className="flex items-center justify-between" id="persona-selector-header">
        <h3 className="font-display font-semibold text-lg text-slate-200 tracking-tight" id="persona-selector-title">
          Base Personality Preset
        </h3>
        <span className="text-xs font-mono text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-full" id="persona-selector-badge">
          4 presets available
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="persona-selector-grid">
        {PERSONA_PRESETS.map((preset) => {
          const isActive = selectedPresetId === preset.id;
          return (
            <button
              key={preset.id}
              id={`persona-btn-${preset.id}`}
              onClick={() => onSelectPreset(preset)}
              className={`flex flex-col text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                isActive
                  ? "bg-slate-800/80 border-slate-600 shadow-md shadow-slate-950/40"
                  : "bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700/60"
              }`}
            >
              {/* Highlight backdrop glow */}
              <div
                className={`absolute inset-0 bg-radial from-slate-700/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="flex items-center gap-3 relative z-10" id={`persona-meta-${preset.id}`}>
                <div
                  className={`p-2 rounded-lg transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? "bg-slate-700" : "bg-slate-800/60"
                  }`}
                  id={`persona-icon-container-${preset.id}`}
                >
                  {getIcon(preset.avatarIcon)}
                </div>
                <div>
                  <h4
                    className={`font-display font-medium text-sm transition-colors ${
                      isActive ? "text-slate-100 font-bold" : "text-slate-300"
                    }`}
                    id={`persona-name-${preset.id}`}
                  >
                    {preset.name}
                  </h4>
                  <p className="text-xs text-slate-400/90 leading-normal mt-1" id={`persona-desc-${preset.id}`}>
                    {preset.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
