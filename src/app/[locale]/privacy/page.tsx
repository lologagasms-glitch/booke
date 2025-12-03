import { TransletText } from '@/app/lib/services/translation/transletText';

export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-6"><TransletText>Politique de Confidentialité</TransletText></h1>
            <div className="prose prose-lg max-w-none text-gray-800">
                <p className="mb-6">
                    <TransletText>
                        Chez Evasion, la sécurité et la confidentialité de vos données personnelles sont notre priorité absolue. Cette politique détaille de manière transparente comment nous collectons, utilisons, protégeons et stockons vos informations.
                    </TransletText>
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4"><TransletText>1. Sécurité des Données</TransletText></h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><TransletText>Chiffrement de bout en bout (TLS 1.3) pour toutes les communications</TransletText></li>
                        <li><TransletText>Stockage des données sur des serveurs sécurisés en Europe conformes au RGPD</TransletText></li>
                        <li><TransletText>Authentification multifacteur pour l'accès aux systèmes administratifs</TransletText></li>
                        <li><TransletText>Sauvegardes automatiques et redondantes toutes les 24 heures</TransletText></li>
                        <li><TransletText>Audits de sécurité trimestriels par des firmes indépendantes</TransletText></li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4"><TransletText>2. Données Collectées</TransletText></h2>
                    <p className="mb-4"><TransletText>Nous collectons uniquement les données nécessaires au fonctionnement du service :</TransletText></p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><TransletText>Informations de contact (email, nom) - chiffrées à la volée</TransletText></li>
                        <li><TransletText>Préférences utilisateur - stockées localement lorsque possible</TransletText></li>
                        <li><TransletText>Données d'utilisation anonymisées pour améliorer nos services</TransletText></li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4"><TransletText>3. Vos Droits</TransletText></h2>
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <p className="font-medium"><TransletText>Vous avez le contrôle total sur vos données :</TransletText></p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li><TransletText>Accès : Téléchargez toutes vos données en un clic</TransletText></li>
                            <li><TransletText>Rectification : Modifiez vos informations à tout moment</TransletText></li>
                            <li><TransletText>Suppression : Suppression définitive sous 30 jours</TransletText></li>
                            <li><TransletText>Portabilité : Exportez vos données dans un format ouvert</TransletText></li>
                        </ul>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4"><TransletText>4. Certifications & Conformité</TransletText></h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border border-green-200 bg-green-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-green-800"><TransletText>ISO 27001</TransletText></h3>
                            <p className="text-sm"><TransletText>Système de gestion de la sécurité de l'information certifié</TransletText></p>
                        </div>
                        <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-blue-800"><TransletText>RGPD</TransletText></h3>
                            <p className="text-sm"><TransletText>Conformité totale au Règlement Général sur la Protection des Données</TransletText></p>
                        </div>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4"><TransletText>5. Transparence</TransletText></h2>
                    <p className="mb-4"><TransletText>
                        Nous maintenons un registre public des incidents de sécurité (zero depuis notre création) et publions 
                        trimestriellement un rapport de transparence détaillant les demandes gouvernementales et les accès aux données.
                    </TransletText></p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4"><TransletText>6. Contact Sécurité</TransletText></h2>
                    <p className="mb-4"><TransletText>
                        Pour toute question concernant la sécurité de vos données ou pour signaler une vulnérabilité :
                    </TransletText></p>
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <p><TransletText>Email : security@evasion.com</TransletText></p>
                        <p><TransletText>Response SLA : 24h maximum</TransletText></p>
                        <p><TransletText>Chiffrement PGP disponible sur demande</TransletText></p>
                    </div>
                </section>

                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-semibold mb-3"><TransletText>Votre vie privée est notre priorité</TransletText></h3>
                    <p><TransletText>
                        Nous nous engageons à protéger vos données avec les plus hauts standards de sécurité. 
                        Aucune donnée n'est vendue, partagée ou utilisée à des fins publicitaires. Vous restez 
                        propriétaire de vos données à tout moment.
                    </TransletText></p>
                </div>
            </div>
        </div>
    );
}
