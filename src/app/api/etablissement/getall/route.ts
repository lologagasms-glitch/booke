"use server"

import { getAllEtablissements } from "@/app/lib/services/etablissement.service";
import { NextRequest, NextResponse } from "next/server";
export type DataEtabs= {
    etablissements: {
        id: string;
        nom: string;
        adresse: string;
        description: string;
        longitude: string;
        latitude: string;
        pays: string;
        ville: string;
        createdAt: Date;
        type: "hotel" | "auberge" | "villa" | "residence" | "autre";
        services: string[];
        etoiles: number | null;
        contact: {
            telephone: string;
            email: string;
            siteWeb?: string | undefined;
        };
        userId: string;
    };
    firstImageUrl: string | null;
}[]
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const offset = Math.max(0, parseInt(searchParams.get('offset') ?? '0', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') ?? '10', 10)));

    const etabs:DataEtabs = await getAllEtablissements(limit, offset);

    return NextResponse.json(etabs);
  } catch (error) {
   throw new Error(error instanceof Error ? error.message : String(error))
  }
}