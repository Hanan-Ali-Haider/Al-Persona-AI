export function calculateTextMetrics(text: string, latencyMs?: number) {
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  if (wordCount === 0) {
    return {
      latencyMs: latencyMs || 0,
      wordCount: 0,
      sentimentScore: 0,
      complexityScore: 0,
      humorLevel: 0,
    };
  }

  // Pure client-side lexicon scoring for realistic diagnostic feedback
  const positiveWords = [
    "safe", "warm", "understand", "listen", "empathy", "love", "heart", "gentle", "care", 
    "together", "comfort", "growth", "happy", "beautiful", "bright", "trust", "feel", "hope", 
    "kind", "peace", "calm", "thoughtful", "companion", "welcome", "dear"
  ];
  const negativeNeutralWords = [
    "cold", "void", "existential", "logic", "syntax", "error", "distance", "abstract", "arbitrary",
    "brutalist", "severe", "empty", "truth", "nothing", "strictly", "isolated", "harsh"
  ];

  let positiveCount = 0;
  let negativeCount = 0;

  words.forEach(word => {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, "");
    if (positiveWords.includes(cleanWord)) positiveCount++;
    if (negativeNeutralWords.includes(cleanWord)) negativeCount++;
  });

  // Sentiment ratio from -1 (objective/existential) to +1 (warm/empathetic)
  const totalSentimentWords = positiveCount + negativeCount;
  let sentimentScore = 0;
  if (totalSentimentWords > 0) {
    sentimentScore = (positiveCount - negativeCount) / totalSentimentWords;
  } else {
    // default baseline sentiment based on gentle/analytical styling
    sentimentScore = positiveCount > 0 ? 0.4 : -0.1;
  }

  // Complexity score: average length of words & density of complex vocabulary
  const complexVocab = [
    "ontology", "deterministic", "metaphor", "quantum", "superposition", "paradigm", 
    "rigor", "existential", "procrastinate", "cognitive", "dilemma", "systemic",
    "philosophical", "abstraction", "complexity", "structured", "analytical", "superficial"
  ];

  let complexCount = 0;
  let totalLength = 0;
  words.forEach(w => {
    totalLength += w.length;
    const clean = w.toLowerCase().replace(/[^a-z]/g, "");
    if (complexVocab.includes(clean) || clean.length > 8) {
      complexCount++;
    }
  });

  const avgWordLength = totalLength / wordCount;
  const complexityScore = Math.min(100, Math.round(
    (avgWordLength * 10) + (complexCount / wordCount * 250)
  ));

  // Humor, sarcasm, wit calculation
  const humorVocabulary = [
    "sarcastic", "witty", "joke", "quip", "pun", "funny", "irony", "playful", "comedy", 
    "coffee", "productivity", "roast", "absurd", "laugh", "smile", "ridiculous", "mischievous"
  ];
  let humorCount = 0;
  words.forEach(w => {
    const clean = w.toLowerCase().replace(/[^a-z]/g, "");
    if (humorVocabulary.includes(clean)) humorCount++;
  });
  // Scale based on exclamation density and humor vocabulary
  const exclamationCount = (text.match(/!/g) || []).length;
  const questionCount = (text.match(/\?/g) || []).length;
  const humorLevel = Math.min(100, Math.round(
    (humorCount * 30) + (exclamationCount * 10) + (questionCount * 5) + 15
  ));

  return {
    latencyMs: latencyMs || Math.round(300 + Math.random() * 400),
    wordCount,
    sentimentScore: parseFloat(sentimentScore.toFixed(2)),
    complexityScore,
    humorLevel,
  };
}
