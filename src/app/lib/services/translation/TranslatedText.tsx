'use client';

import { useQuery } from "@tanstack/react-query";
import { traduireTexteSecurise } from "./translateApiWithLingvaAndVercel";

interface TranslatedTextProps {
    text: string;
    targetLang: string;
    sourceLang?: string;
    className?: string;
    as?: React.ElementType; // Permet de rendre un span, p, h1, etc.
}

export function TranslatedText({
    text,
    targetLang,
    sourceLang = "fr",
    className,
    as: Component = "span",
}: TranslatedTextProps) {
    const shouldTranslate = targetLang !== sourceLang && text.trim() !== "";

    const { data: translatedText, isLoading } = useQuery({
        queryKey: ["translation", text, targetLang],
        queryFn: async () => {
            if (!shouldTranslate) return text;
            return await traduireTexteSecurise(text, sourceLang, targetLang);
        },
        enabled: shouldTranslate,
        staleTime: Infinity, // Cache indéfini pour les traductions statiques
        retry: false,
    });

    if (isLoading) {
        return <span className={`animate-pulse bg-gray-200 rounded text-transparent ${className}`}>{text}</span>;
    }

    return (
        <Component className={className}>
            {translatedText || text}
        </Component>
    );
}
