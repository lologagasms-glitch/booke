'use client'

import { useQuery } from "@tanstack/react-query";
import { traduireTexteSecurise } from "./translateApiWithLingvaAndVercel";
import { ChangeEvent } from "react";

// 🔑 OMIT la prop 'placeholder' qui entre en conflit
interface TranslatedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'placeholder'> {
  placeholder: string;
  targetLang: string;
  sourceLang?: string;
}

export function Input({
  placeholder,
  targetLang,
  sourceLang = "fr",
  disabled,
  className,
  ...inputProps // ➕ Récupérez TOUTES les autres props input valides
}: TranslatedInputProps) {

  const shouldTranslate = targetLang !== "fr" && placeholder.trim() !== "";
  
  const { data: translatedPlaceholder, isLoading } = useQuery({
    queryKey: ["translationPlaceholder", placeholder, targetLang],
    queryFn: async () => {
      const res = await traduireTexteSecurise(placeholder, sourceLang, targetLang);
      return res;
    },
    enabled: shouldTranslate,
    staleTime: 1000 * 60 * 60, // 1h de cache
    retry: false,
  });

  // ✅ Fallback intelligent : traduction > clé > vide
  const finalPlaceholder = translatedPlaceholder || placeholder;

  return (
    <input
      {...inputProps} // ➕ Déversez TOUTES les props input ici
      placeholder={finalPlaceholder}
      disabled={disabled || isLoading}
      className={className}
    />
  )
}