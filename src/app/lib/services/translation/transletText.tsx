"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {  traduireTexteSecurise } from "./translateApiWithLingvaAndVercel";
import { useEffect } from "react";

interface TransletTextProps {
  children: string | string[];
  targetLang?: string;
}

export function TransletText({ children }: TransletTextProps) {
  const {locale} = useParams();
  const targetLang = locale?.toString() ||"fr";
  
  const textArray = Array.isArray(children) ? children : [children];
  const shouldTranslate = targetLang !== "fr" && textArray.some(t => t.trim() !== "");

  const { data:translateText, isLoading, error } = useQuery({
    queryKey: ["translation", textArray, targetLang],
    queryFn: async () => {
      const res = await Promise.all(
        textArray.map(txt => traduireTexteSecurise(txt, "fr", targetLang))
      );
      return res;
    },
    enabled: shouldTranslate,
  });

  if (!shouldTranslate) return <>{children}</>;
  if (isLoading) return
  if (error) return <>Erreur : {error.message}</>;

  const translated = translateText || textArray;
  return <>{Array.isArray(children) ? translated : translated[0]}</>;
}
