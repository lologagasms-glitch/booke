// app/api/reservations/route.ts
import { auth } from '@/app/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getReservationsByUserId } from './services.db';

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const rows = await getReservationsByUserId(session.user.id);

    return NextResponse.json({ reservations: rows });
  } catch (err: any) {
    console.error('[GET /api/reservations]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}