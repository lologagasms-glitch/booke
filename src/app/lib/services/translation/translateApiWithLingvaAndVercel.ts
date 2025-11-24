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

// ✅ Dictionnaire Local pour Optimisation
const LOCAL_DICTIONARY: Record<string, Record<string, string>> = {
  "Bookeing : Votre voyage commence ici": {
    "en": "Bookeing: Your journey starts here",
    "es": "Bookeing: Tu viaje comienza aquí",
    "de": "Bookeing: Ihre Reise beginnt hier",
    "it": "Bookeing: Il tuo viaggio inizia qui",
  },
  "La première plateforme de réservation française qui met l'expérience voyageur au cœur de tout.": {
    "en": "The first French booking platform that puts the traveler experience at the heart of everything.",
    "es": "La primera plataforma de reservas francesa que pone la experiencia del viajero en el centro de todo.",
  },
  "Nous croyons que chaque nuit compte, chaque détail importe.": {
    "en": "We believe that every night counts, every detail matters.",
    "es": "Creemos que cada noche cuenta, cada detalle importa.",
  },
  "Découvrez notre histoire": {
    "en": "Discover our story",
    "es": "Descubre nuestra historia",
  },
  "Nous contacter": {
    "en": "Contact us",
    "es": "Contáctanos",
  },
  "Pourquoi Bookeing est différent": {
    "en": "Why Bookeing is different",
    "es": "Por qué Bookeing es diferente",
  },
  "Aucune commission cachée": {
    "en": "No hidden fees",
    "es": "Sin comisiones ocultas",
  },
  "Nos prix sont transparents. Ce que vous voyez est ce que vous payez.": {
    "en": "Our prices are transparent. What you see is what you pay.",
    "es": "Nuestros precios son transparentes. Lo que ves es lo que pagas.",
  },
  "Support humain 24/7": {
    "en": "24/7 Human Support",
    "es": "Soporte humano 24/7",
  },
  "Notre équipe française vous répond en moins de 2 minutes en moyenne.": {
    "en": "Our French team answers you in less than 2 minutes on average.",
    "es": "Nuestro equipo francés le responde en menos de 2 minutos en promedio.",
  },
  "Annulation flexible": {
    "en": "Flexible cancellation",
    "es": "Cancelación flexible",
  },
  "Jusqu'à 48h avant votre arrivée sur la majorité de nos offres.": {
    "en": "Up to 48h before arrival on most of our offers.",
    "es": "Hasta 48h antes de su llegada en la mayoría de nuestras ofertas.",
  },
  "Paiement sécurisé": {
    "en": "Secure payment",
    "es": "Pago seguro",
  },
  "Transactions cryptées et protection des données garanties.": {
    "en": "Encrypted transactions and guaranteed data protection.",
    "es": "Transacciones encriptadas y protección de datos garantizada.",
  },
  "Nos utilisateurs en parlent mieux que nous": {
    "en": "Our users say it better than us",
    "es": "Nuestros usuarios lo dicen mejor que nosotros",
  },
  "Bookeing en quelques chiffres": {
    "en": "Bookeing in numbers",
    "es": "Bookeing en cifras",
  },
  "Établissements partenaires": {
    "en": "Partner establishments",
    "es": "Establecimientos asociados",
  },
  "Nuits réservées": {
    "en": "Nights booked",
    "es": "Noches reservadas",
  },
  "Note moyenne": {
    "en": "Average rating",
    "es": "Calificación promedio",
  },
  "Support réactif": {
    "en": "Responsive support",
    "es": "Soporte receptivo",
  },
};

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

  // 1. Vérifier le dictionnaire local
  if (LOCAL_DICTIONARY[texte] && LOCAL_DICTIONARY[texte][targetLang]) {
    // console.log(`⚡ Traduction locale trouvée: "${texte}" -> "${LOCAL_DICTIONARY[texte][targetLang]}"`);
    return LOCAL_DICTIONARY[texte][targetLang];
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
    return null;
  }
}