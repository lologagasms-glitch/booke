import { getAllReservations } from '@/app/lib/services/reservation.service'
import ReservationsList from '@/components/reservations/reservations-list'

export default async function ReservationsPage() {
    // In a real app, we would get the current user's ID and fetch their reservations
    // For now, we'll fetch all reservations as requested/implied for the demo
    const reservations = await getAllReservations()

    // Transform the data to match the component's expected type if necessary
    // The service returns dates as Date objects, which is what we want.
    // We just need to ensure the types align.

    // Cast to any if needed to bypass strict type checks for now, 
    // but ideally we should match the types perfectly.
    // The service returns: 
    // { ...reservation, user, chambre, etablissement }
    // Our component expects:
    // { id, dateDebut, dateFin, nombrePersonnes, prixTotal, statut, etablissement: { nom, ville, pays, type }, chambre: { nom, type }, user: { name, email } }

    const formattedReservations = reservations?.map(r => ({
        id: r.id,
        dateDebut: r.dateDebut,
        dateFin: r.dateFin,
        nombrePersonnes: r.nombrePersonnes,
        prixTotal: r.prixTotal,
        statut: r.statut as 'confirm' | 'en_attente' | 'annul',
        etablissement: r.etablissement ? {
            nom: r.etablissement.nom,
            ville: r.etablissement.ville,
            pays: r.etablissement.pays,
            type: r.etablissement.type
        } : undefined,
        chambre: r.chambre ? {
            nom: r.chambre.nom,
            type: r.chambre.type
        } : undefined,
        user: r.user ? {
            name: r.user.name,
            email: r.user.email
        } : undefined
    }))

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
                        Mes Réservations
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Gérez vos séjours passés, présents et futurs en un coup d'œil.
                    </p>
                </div>

                <ReservationsList reservations={formattedReservations || []} />
            </div>
        </div>
    )
}
