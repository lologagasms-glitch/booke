
import { getById } from '@/app/lib/services/chambre.service';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const paramsSchema = z.object({
  room: z.string().min(5, 'ID de chambre invalide')
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = paramsSchema.safeParse({ room: searchParams.get('room') });

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 });
    }

    const room = await getById(parsed.data.room);
    if (!room) {
      return NextResponse.json({ error: 'Chambre introuvable' }, { status: 404 });
    }

    return NextResponse.json(room, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}