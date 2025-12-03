"use server"
import { unstable_cache } from 'next/cache';
import { z } from 'zod'; // Pour validation robuste

// ✅ Types stricts
interface TranslationInfo {
  pronunciation: Record<string, string>;
  definitions: string[];
  examples: { text: string; translation: string }[];
  similar: string[];
  extraTranslations: string[];
}

interface ApiResponse {
  translation: string;
  info: TranslationInfo;
}

// ✅ Validation des entrées
const langSchema = z.string().length(2).regex(/^[a-z]{2}$/);
const textSchema = z.string().min(1).max(5000);


// ✅ Fetch avec timeout et meilleure gestion
const fetchTraduction = async (
  texte: string,
  sourceLang: string,
  targetLang: string
): Promise<ApiResponse> => {
  // Validation
  langSchema.parse(sourceLang);
  langSchema.parse(targetLang);
  textSchema.parse(texte);

  const texteEncode = encodeURIComponent(texte);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // Timeout 8s

  try {
    const reponse = await fetch(
      `https://mon-premier-lyart.vercel.app/api/v1/${sourceLang}/${targetLang}/${texteEncode}`,
      {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Next.js-Translator/1.0'
        }
      }
    );

    if (!reponse.ok) {
      throw new Error(`Erreur HTTP: ${reponse.status}`);
    }

    return await reponse.json();
  } finally {
    clearTimeout(timeoutId);
  }
};

// ✅ Cache avec tags pour invalidation
export const traduireTexte = unstable_cache(
  fetchTraduction,
  ['traduction-api'],
  {
    revalidate: 3600 * 24, // 24 heures (augmenté pour perf)
    tags: ['translations'], // Pour revalidateTag('translations')
  }
);

// ✅ Wrapper amélioré
export async function traduireTexteSecurise(
  texte: string,
  sourceLang: string = "fr",
  targetLang: string
): Promise<string | null> {
  // Validation en amont
  if (!texte?.trim()) {
    console.error('❌ Texte vide ou invalide');
    return null;
  }

  if (!targetLang || sourceLang === targetLang) {
    // console.error('❌ Langues invalides ou identiques');
    return texte; // Retourne le texte original si pas de traduction nécessaire
  }



  // console.log(`📡 Traduction API requise: "${texte}" (${sourceLang} → ${targetLang})`);

  try {
    const { translation } = await fetchTraduction(texte, sourceLang, targetLang);
    return translation;
  } catch (erreur) {
    // Gestion fine des erreurs
    if (erreur instanceof Error) {
      if (erreur.name === 'AbortError') {
        console.error('❌ Timeout dépassé');
      } else if (erreur.message.includes('HTTP')) {
        console.error('❌ Erreur API:', erreur.message);
      } else {
        console.error('❌ Erreur inattendue:', erreur);
      }
    }
    return texte;
  }
}