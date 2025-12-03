import { TransletText } from '@/app/lib/services/translation/transletText';

export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-6"><TransletText>Conditions Générales d'Utilisation</TransletText></h1>
            <div className="prose max-w-none space-y-6 text-gray-800">
                <p>
                    <TransletText>
                        Veuillez lire attentivement nos conditions générales d'utilisation avant d'utiliser nos services.
                    </TransletText>
                </p>

                <section>
                    <h2 className="text-xl font-semibold mt-6 mb-2"><TransletText>1. Acceptation des conditions</TransletText></h2>
                    <p>
                        <TransletText>
                            En accédant et en utilisant ce site, vous acceptez d'être lié par ces conditions générales d'utilisation.
                            Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
                        </TransletText>
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mt-6 mb-2"><TransletText>2. Description des services</TransletText></h2>
                    <p>
                        <TransletText>
                            Nous fournissons une plateforme de réservation d'expériences touristiques et d'activités.
                            Les services sont fournis "tels quels" et peuvent être modifiés ou interrompus à tout moment.
                        </TransletText>
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mt-6 mb-2"><TransletText>3. Responsabilités de l'utilisateur</TransletText></h2>
                    <p>
                        <TransletText>
                            Vous vous engagez à utiliser nos services de manière légale et éthique.
                            Vous êtes responsable de la véracité des informations fournies lors de vos réservations.
                        </TransletText>
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mt-6 mb-2"><TransletText>4. Paiement et remboursement</TransletText></h2>
                    <p>
                        <TransletText>
                            Les prix sont indiqués en euros et incluent la TVA applicable.
                            Les conditions de remboursement dépendent de la politique d'annulation spécifique à chaque expérience.
                        </TransletText>
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mt-6 mb-2"><TransletText>5. Propriété intellectuelle</TransletText></h2>
                    <p>
                        <TransletText>
                            Tout le contenu de ce site, incluant textes, images et logos, est protégé par les lois sur la propriété intellectuelle.
                            Toute reproduction ou utilisation non autorisée est strictement interdite.
                        </TransletText>
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mt-6 mb-2"><TransletText>6. Limitation de responsabilité</TransletText></h2>
                    <p>
                        <TransletText>
                            Nous ne pourrons être tenus responsables des dommages indirects ou consécutifs résultant de l'utilisation de nos services.
                            Notre responsabilité est limitée au montant payé pour la réservation concernée.
                        </TransletText>
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mt-6 mb-2"><TransletText>7. Modification des conditions</TransletText></h2>
                    <p>
                        <TransletText>
                            Nous nous réservons le droit de modifier ces conditions à tout moment.
                            Les modifications seront effectives dès leur publication sur le site.
                        </TransletText>
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mt-6 mb-2"><TransletText>8. Droit applicable</TransletText></h2>
                    <p>
                        <TransletText>
                            Ces conditions sont soumises au droit français.
                            Tout litige sera soumis aux tribunaux compétents de Paris.
                        </TransletText>
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mt-6 mb-2"><TransletText>9. Contact</TransletText></h2>
                    <p>
                        <TransletText>
                            Pour toute question concernant ces conditions, veuillez nous contacter à l'adresse suivante :
                        </TransletText>
                        <br />
                        <TransletText>Email :</TransletText> contact@evasion.com
                        <br />
                        <TransletText>Téléphone :</TransletText> +33 1 23 45 67 89
                    </p>
                </section>

                <p className="text-sm text-gray-600 mt-8">
                    <TransletText>
                        Dernière mise à jour : 15 juin 2024
                    </TransletText>
                </p>
            </div>
        </div>
    );
}
