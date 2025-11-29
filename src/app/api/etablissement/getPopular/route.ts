"use server"

import { getPopularEtablissements } from "@/app/lib/services/etablissement.service";
import { NextRequest, NextResponse } from "next/server";
export type DataEtabsPopularType= {
    mediaUrl: string | null;
    etablissementId: string;
    nom: string;
    ville: string;
    pays: string;
    etoiles: number | null;
    services: string[];
    prixMin: number | null;
    totalResa: number;
}[]
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') ?? '10', 10)));

    const etabs:DataEtabsPopularType = await getPopularEtablissements(limit);

    return NextResponse.json(etabs);
  } catch (error) {
   throw new Error(error instanceof Error ? error.message : String(error))
  }
}