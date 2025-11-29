"use server"

import { getEtablissementById } from "@/app/lib/services/etablissement.service";
import { NextRequest, NextResponse } from "next/server";
export type EtabAndContentsType={
    id: string;
    createdAt: Date;
    userId: string;
    nom: string;
    adresse: string;
    description: string;
    longitude: string;
    latitude: string;
    pays: string;
    ville: string;
    type: "hotel" | "auberge" | "villa" | "residence" | "autre";
    services: string[];
    etoiles: number | null;
    contact: {
        telephone: string;
        email: string;
        siteWeb?: string | undefined;
    };
    chambres: {
        id: string;
        createdAt: Date;
        nom: string;
        description: string;
        type: string;
        services: string[] | null;
        etablissementId: string;
        prix: number;
        capacite: number;
        disponible: boolean;
        medias: {
            id: string;
            createdAt: Date;
            type: "image" | "video";
            url: string;
            filename: string;
            chambreId: string;
        }[];
    }[];
    medias: {
        id: string;
        etablissementId: string;
        url: string;
        filename: string;
        type: "image" | "video";
        createdAt: Date;
    }[];
} | undefined
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id')
    const etabs:EtabAndContentsType =await getEtablissementById(id as string)
    return NextResponse.json(etabs);
  } catch (error) {
   throw new Error(error instanceof Error ? error.message : String(error))
  }
}