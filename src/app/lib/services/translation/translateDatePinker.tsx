'use client'

import { useQuery } from "@tanstack/react-query";
import { traduireTexteSecurise } from "./translateApiWithLingvaAndVercel";
import DatePicker from "react-datepicker";
import { fr } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";
import React from "react";

// ✅ Extraction robuste des types
type DatePickerProps = React.ComponentProps<typeof DatePicker>;

// 🔑 Interface propre
interface TranslatedDatePickerProps extends Omit<DatePickerProps, 'placeholderText'> {
  placeholderText: string;
  targetLang: string;
  sourceLang?: string;
}

export function TranslatedDatePicker({
  placeholderText,
  targetLang,
  sourceLang = "fr",
  disabled,
  className,
  locale,
  ...datePickerProps
}: TranslatedDatePickerProps) {

  const shouldTranslate = targetLang !== "fr" && placeholderText.trim() !== "";

  const { data: translatedPlaceholder, isLoading } = useQuery({
    queryKey: ["translationPlaceholder", placeholderText, targetLang],
    queryFn: async () => {
      const res = await traduireTexteSecurise(placeholderText, sourceLang, targetLang);
      return res;
    },
    enabled: shouldTranslate,
    staleTime: 1000 * 60 * 60,
    retry: false,
  });

  const finalPlaceholder = translatedPlaceholder || placeholderText;

  return (
    <DatePicker
      {...datePickerProps as any} // 🎯 CAST NÉCESSAIRE pour discriminant
      placeholderText={finalPlaceholder}
      disabled={disabled || isLoading}
      className={className}
      locale={locale || fr}
    />
  );
}