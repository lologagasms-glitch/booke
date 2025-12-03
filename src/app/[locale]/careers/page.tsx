import { TransletText } from '@/app/lib/services/translation/transletText';

export default function CareersPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-8 text-center text-emerald-600">
                <TransletText>Rejoignez Notre Équipe</TransletText>
            </h1>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                <TransletText>Chez Evasion, nous sommes passionnés par l'hospitalité et l'aventure. Nous recherchons des talents créatifs et dévoués pour nous aider à créer des expériences inoubliables pour nos clients.</TransletText>
            </p>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Job Listing 1 */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-semibold mb-2 text-gray-800">
                        <TransletText>Développeur Front-end</TransletText>
                    </h2>
                    <p className="text-sm text-emerald-500 font-medium mb-4">
                        <TransletText>Temps plein • Télétravail</TransletText>
                    </p>
                    <p className="text-gray-600 mb-6">
                        <TransletText>Nous recherchons un développeur passionné par React et l'expérience utilisateur pour améliorer notre plateforme de réservation.</TransletText>
                    </p>
                    <button className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors w-full">
                        <TransletText>Postuler</TransletText>
                    </button>
                </div>

                {/* Job Listing 2 */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-semibold mb-2 text-gray-800">
                        <TransletText>Manager d'Hôtel</TransletText>
                    </h2>
                    <p className="text-sm text-emerald-500 font-medium mb-4">
                        <TransletText>Temps plein • Paris</TransletText>
                    </p>
                    <p className="text-gray-600 mb-6">
                        <TransletText>Vous avez l'âme d'un leader et une expérience dans l'hôtellerie de luxe ? Rejoignez-nous pour diriger notre nouvel établissement parisien.</TransletText>
                    </p>
                    <button className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors w-full">
                        <TransletText>Postuler</TransletText>
                    </button>
                </div>

                {/* Job Listing 3 */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-semibold mb-2 text-gray-800">
                        <TransletText>Support Client</TransletText>
                    </h2>
                    <p className="text-sm text-emerald-500 font-medium mb-4">
                        <TransletText>Temps partiel • Lyon</TransletText>
                    </p>
                    <p className="text-gray-600 mb-6">
                        <TransletText>Aidez nos clients à planifier leur séjour parfait. Nous cherchons une personne empathique et organisée pour notre équipe support.</TransletText>
                    </p>
                    <button className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors w-full">
                        <TransletText>Postuler</TransletText>
                    </button>
                </div>

                {/* Job Listing 4 */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-semibold mb-2 text-gray-800">
                        <TransletText>Chef de Cuisine</TransletText>
                    </h2>
                    <p className="text-sm text-emerald-500 font-medium mb-4">
                        <TransletText>Temps plein • Bordeaux</TransletText>
                    </p>
                    <p className="text-gray-600 mb-6">
                        <TransletText>Prenez les rênes de notre restaurant gastronomique. Créativité et passion pour les produits locaux sont indispensables.</TransletText>
                    </p>
                    <button className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors w-full">
                        <TransletText>Postuler</TransletText>
                    </button>
                </div>
            </div>

            <div className="mt-16 text-center bg-gray-50 p-8 rounded-xl">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                    <TransletText>Candidature Spontanée</TransletText>
                </h3>
                <p className="text-gray-600 mb-6">
                    <TransletText>Vous ne trouvez pas le poste idéal ? Envoyez-nous votre CV et dites-nous comment vous pouvez contribuer à l'aventure Evasion.</TransletText>
                </p>
                <button className="border-2 border-emerald-600 text-emerald-600 px-6 py-2 rounded-md hover:bg-emerald-50 transition-colors font-medium">
                    <TransletText>Envoyer mon CV</TransletText>
                </button>
            </div>
        </div>
    );
}
