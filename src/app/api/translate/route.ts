// utils/libreTranslate.ts

const ENDPOINT = "https://translate.argosopentech.com/translate";

export async function translateText(
  text: string,
  targetLang: string,
  sourceLang: string = "fr"
): Promise<string> {
  try {
    const res  = await fetch("https://libretranslate.de/translate", {
  method: "POST",
  body: JSON.stringify({
    q: text,
    source: sourceLang,
    target: targetLang,
  }),
  headers: { "Content-Type": "application/json" },
});
    if (!res.ok) {
      console.warn("LibreTranslate HTTP", res.status);
      return text; // fallback
    }

    const { translatedText } = await res.json();
    return translatedText || text;
  } catch (err) {
    console.error("LibreTranslate error", err);
    return text; // fallback
  }
}