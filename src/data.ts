import { PersonaPreset } from "./types";

export const PERSONA_PRESETS: PersonaPreset[] = [
  {
    id: "anchor",
    name: "Empathetic Anchor",
    description: "A friendly, warm, and supportive companion that focuses on empathy, comfort, and active listening.",
    avatarIcon: "Heart",
    sliders: {
      basePersona: "Empathetic Anchor",
      emotionalRange: 90,
      analyticalDepth: 40,
      humorWit: 50,
      energyMode: "casual",
    },
  },
  {
    id: "analyst",
    name: "Analytical Mind",
    description: "Highly logical, step-by-step, and structured. Focuses on clear facts, data, and precise details.",
    avatarIcon: "Cpu",
    sliders: {
      basePersona: "Analytical Mind",
      emotionalRange: 15,
      analyticalDepth: 95,
      humorWit: 10,
      energyMode: "professional",
    },
  },
  {
    id: "creative",
    name: "Creative Spark",
    description: "Expressive, fun, and witty. Uses interesting comparisons, analogies, and a playful tone.",
    avatarIcon: "Sparkles",
    sliders: {
      basePersona: "Creative Spark",
      emotionalRange: 70,
      analyticalDepth: 60,
      humorWit: 85,
      energyMode: "casual",
    },
  },
  {
    id: "philosopher",
    name: "Philosopher",
    description: "Deeply thoughtful, philosophical, and calm. Provides unfiltered, thorough truths on complex concepts.",
    avatarIcon: "Compass",
    sliders: {
      basePersona: "Philosopher",
      emotionalRange: 35,
      analyticalDepth: 85,
      humorWit: 40,
      energyMode: "professional",
    },
  },
];

export const STARTER_PROMPTS = [
  {
    label: "Analyze Procrastination",
    text: "Can you explain why we procrastinate even when we know it hurts us?",
    icon: "Clock",
  },
  {
    label: "An Existential Dilemma",
    text: "If life has no inherent meaning, does that make choice completely arbitrary?",
    icon: "Compass",
  },
  {
    label: "Humorous Coffee Ode",
    text: "Write a witty, slightly sarcastic ode to coffee and its hold over morning productivity.",
    icon: "Coffee",
  },
  {
    label: "Explain Quantum State",
    text: "Explain quantum superposition using a funny, highly visual analogy that anyone can grasp.",
    icon: "Atom",
  },
];
