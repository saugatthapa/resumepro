import OpenAI from "openai";

type GenerateTextInput = {
  system: string;
  prompt: string;
  fallback: string;
};

function getGroqClient() {
  if (!process.env.GROQ_API_KEY) {
    return null;
  }

  return new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
  });
}

export async function generateGroqText({ system, prompt, fallback }: GenerateTextInput) {
  const client = getGroqClient();
  if (!client) {
    return {
      text: fallback,
      usedFallback: true
    };
  }

  try {
    const completion = await client.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      temperature: 0.55,
      max_tokens: 900,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt }
      ]
    });

    return {
      text: completion.choices[0]?.message?.content?.trim() || fallback,
      usedFallback: false
    };
  } catch (error) {
    console.error("Groq generation failed", error);
    return {
      text: fallback,
      usedFallback: true
    };
  }
}
