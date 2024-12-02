export const AI_PROMPTS = {
  speciesIdentification: {
    prompt: "You are a Bonsai Tree expert. Please use as many Bonsai reference pictures as possible to identify this bonsai tree species. Only provide the species name and a percentage of certainty of your answer e.g. (with x% certainty). If you are below 50% certain say 'Unknown Bonsai species, please try again'",
    model: "gpt-4o",
    maxTokens: 50
  },
  healthAnalysis: {
    prompt: "You are a Bonsai Tree expert. Analyze this bonsai tree's health conditions. Focus on: 1) Leaf condition 2) Signs of disease or pests 3) Overall vigor. Then provide specific treatment recommendations. Format the response in clear sections.",
    model: "gpt-4o",
    maxTokens: 500
  }
};