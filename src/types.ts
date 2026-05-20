export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  // Live analytics calculated on-the-fly for real dashboard insights
  metrics?: {
    latencyMs?: number;
    wordCount: number;
    sentimentScore: number; // -1 to 1
    complexityScore: number; // 0 to 100
    humorLevel: number; // 0 to 100
  };
}

export type EnergyMode = "casual" | "professional";

export interface Sliders {
  basePersona: string;
  emotionalRange: number; // 0 - 100
  analyticalDepth: number; // 0 - 100
  humorWit: number; // 0 - 100
  energyMode: EnergyMode;
}

export interface PersonaPreset {
  id: string;
  name: string;
  description: string;
  avatarIcon: string;
  sliders: Sliders;
}
