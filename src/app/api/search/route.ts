"use server"
import { NextRequest, NextResponse } from "next/server"
import { searchData } from "@/app/lib/services/etablissement.service"

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams
  const toNum = (k: string) => {
    const v = sp.get(k)
    return v != null ? Number(v) : undefined
  }
  const toBool = (k: string) => {
    const v = sp.get(k)
    return v != null ? v === "true" : undefined
  }

  const params = {
    destination: sp.get("destination") ?? undefined,
    checkIn: sp.get("checkIn") ?? undefined,
    checkOut: sp.get("checkOut") ?? undefined,
    adults: toNum("adults"),
    children: toNum("children"),
    guests: toNum("guests"),
    chambre: toNum("chambre"),
    page: sp.get("page") ?? undefined,
    type: sp.get("type") ?? undefined,
    services: sp.getAll("services")?.length ? sp.getAll("services") : undefined,
    minPrice: sp.get("minPrice") ?? undefined,
    maxPrice: sp.get("maxPrice") ?? undefined,
    sortBy: sp.get("sortBy") ?? undefined,
    stars: toNum("stars"),
    ville: sp.get("ville") ?? undefined,
    pays: sp.get("pays") ?? undefined,
    prixMin: sp.get("prixMin") ?? undefined,
    prixMax: sp.get("prixMax") ?? undefined,
    capaciteMin: sp.get("capaciteMin") ?? undefined,
    capaciteMax: sp.get("capaciteMax") ?? undefined,
    dateDebut: sp.get("dateDebut") ?? undefined,
    dateFin: sp.get("dateFin") ?? undefined,
    etoiles: toNum("etoiles"),
    disponible: toBool("disponible"),
    etablissementId: sp.get("etablissementId") ?? undefined,
  }

  const data = await searchData(params)
  return NextResponse.json(data)
}
