export function parseAIResponse(text: string): any | null {
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse AI response as JSON:", err);
    return null;
  }
}
