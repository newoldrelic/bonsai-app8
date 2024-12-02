export const AI_PROMPTS = {
  speciesIdentification: {
    prompt: "Please identify this bonsai tree species. Only provide the species name and nothing else. If you're not completely sure, provide your best guess but start with 'Likely: '",
    model: "gpt-4o",
    maxTokens: 50
  },
  healthAnalysis: {
    prompt: "Analyze this bonsai tree's health conditions. Focus on: 1) Leaf condition 2) Signs of disease or pests 3) Overall vigor. Then provide specific treatment recommendations. Format the response in clear sections.",
    model: "gpt-4o",
    maxTokens: 500
  }
};