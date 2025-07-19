// chatgpt.ts
import { OPENAI_API_KEY, OPENAI_API_URL } from "./config";

export async function askChatGPT(message: string): Promise<string> {
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Tu es un assistant agricole expert en jardinage. Réponds simplement, en donnant des conseils pratiques pour entretenir les plantes recommandées.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.choices) {
      console.error("Réponse API non valide :", data);
      return "🌧️ Une erreur est survenue. Réessaie plus tard.";
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Erreur avec ChatGPT:", error);
    return "❌ Impossible de contacter l’assistant. Vérifie ta connexion.";
  }
}
