"use server"
import { getAllMediaImages } from '@/app/lib/services/etablissement.service';
import { NextRequest, NextResponse } from 'next/server';
import { sleep } from "workflow";
export type Carousel= ({
    id: string;
    url: string;
    type: "image" | "video";
    etablissementId: string;
    chambreId: unknown;
} | {
    id: string;
    url: string;
    type: "image" | "video";
    etablissementId: unknown;
    chambreId: string;
})[]
// GET /api/carousel
export async function GET(request: NextRequest) {
  const limitParam = request.nextUrl.searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam, 10) : undefined;
  const data:Carousel=await getAllMediaImages(limit)
  return NextResponse.json(data);
}


