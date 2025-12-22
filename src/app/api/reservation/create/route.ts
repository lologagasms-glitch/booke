
import { NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';
import { createReservation } from '@/app/lib/services/reservation.service';
import { z } from 'zod';

const userSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Téléphone requis'),
  checkIn: z.string().min(1, "Date d'arrivée requise"),
  checkOut: z.string().min(1, 'Date de départ requise'),
  guests: z.number().min(1, 'Au moins 1 personne').max(10, 'Maximum 10 personnes'),
  acceptCGV: z.boolean()
  .refine(val => val === true, {
    message: 'Vous devez accepter les conditions'
  })
});

const roomSchema = z.object({
  roomId: z.string().min(5),
  etablissementId: z.string().min(5),
  roomPrix: z.number()
});

export async function POST(req: Request) {

    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
     const formData = await req.formData();
    const rawReservation = formData.get('reservation');
    const rawRoom        = formData.get('room');
    if(!(rawReservation ||rawRoom) ){
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    } 
    const reservation=JSON.parse(rawReservation as string)
    const room=JSON.parse(rawRoom as string)
    console.log(reservation,room)
    try {

   
    const roomParsed = roomSchema.safeParse(room);
    console.log(roomParsed)
    if (!roomParsed.success)
      return NextResponse.json({ error: roomParsed.error.message }, { status: 400 });

    const userParsed = userSchema.safeParse(reservation);
    console.log(userParsed)
    if (!userParsed.success)
      return NextResponse.json({ error: userParsed.error.message }, { status: 400 });

    const { roomId, etablissementId, roomPrix } = roomParsed.data;
    const { checkIn, checkOut, guests, ...userData } = userParsed.data;

    const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
    const prixTotal = roomPrix * nights;

    await createReservation({
      roomId,
      userId: session.user.id,
      etablissementId,
      dateDebut: new Date(checkIn),
      dateFin: new Date(checkOut),
      nombrePersonnes: guests,
      prixTotal,
      statut: 'en_attente',
      ...userData
    });

    return NextResponse.json({ message: 'Votre réservation est enregistrée avec succès.' }, { status: 201 });
  } catch (e: any) {
    console.error('Erreur lors de la réservation', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}