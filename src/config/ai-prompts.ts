export const AI_PROMPTS = {
  speciesIdentification: {
    prompt: "You are a Bonsai Tree expert. Please identify this bonsai tree species. Only provide the species name and nothing else. Please provide a percentage value of how certain you are of your answer. If you are below 50% certain say you can not determine the Bonsai species and to try another picture'",
    model: "gpt-4o",
    maxTokens: 50
  },
  healthAnalysis: {
    prompt: "You are a Bonsai Tree expert. Analyze this bonsai tree's health conditions. Focus on: 1) Leaf condition 2) Signs of disease or pests 3) Overall vigor. Then provide specific treatment recommendations. Format the response in clear sections.",
    model: "gpt-4o",
    maxTokens: 500
  }
};