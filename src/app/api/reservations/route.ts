import { NextRequest, NextResponse } from 'next/server';
import { reservationService } from '@/app/lib/services/reservation.service';
import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({headers:await headers()});
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const id = searchParams.get('id');

    // Vérifier que l'utilisateur demande ses propres réservations ou est admin
    if (userId && userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    if (id) {
      const reservation = await reservationService.getById(id);
      if (!reservation) {
        return NextResponse.json({ error: 'Réservation non trouvée' }, { status: 404 });
      }
      
      // Vérifier que l'utilisateur accède à sa propre réservation ou est admin
      if (reservation.userId !== session.user.id && session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
      }
      
      return NextResponse.json(reservation);
    }

    const userIdToUse = userId || session.user.id;
    const reservations = await reservationService.getByUserId(userIdToUse);
    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({headers:await headers()});
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const data = await request.json();
    
    // Vérifier que l'utilisateur crée une réservation pour lui-même
    if (data.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const reservation = await reservationService.create({
      userId: data.userId,
      roomId: data.roomId,
      etablissementId: data.etablissementId,
      dateDebut: new Date(data.dateDebut),
      dateFin: new Date(data.dateFin),
      nombrePersonnes: data.nombrePersonnes,
      prixTotal: data.prixTotal
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}