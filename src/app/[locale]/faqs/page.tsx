import { TransletText } from '@/app/lib/services/translation/transletText';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';

export default function FaqPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-8 text-center"><TransletText>Foire Aux Questions (FAQ)</TransletText></h1>

            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-semibold mb-4"><TransletText>Réservations</TransletText></h2>
                    <Accordion>
                        <AccordionItem title={<TransletText>Comment effectuer une réservation ?</TransletText>}>
                            <p><TransletText>Pour effectuer une réservation, naviguez vers la page de nos établissements, sélectionnez celui qui vous intéresse, choisissez vos dates et cliquez sur "Réserver". Suivez ensuite les instructions pour finaliser votre paiement.</TransletText></p>
                        </AccordionItem>
                        <AccordionItem title={<TransletText>Puis-je modifier ou annuler ma réservation ?</TransletText>}>
                            <p><TransletText>Oui, vous pouvez modifier ou annuler votre réservation depuis votre compte utilisateur dans la section "Mes Réservations". Veuillez noter que des frais peuvent s'appliquer selon nos conditions d'annulation.</TransletText></p>
                        </AccordionItem>
                        <AccordionItem title={<TransletText>Quelles sont les conditions d'annulation ?</TransletText>}>
                            <p><TransletText>Nos conditions d'annulation varient selon l'établissement et le type de tarif choisi. Les détails sont indiqués lors de la réservation et dans votre email de confirmation. En général, une annulation gratuite est possible jusqu'à 48h avant l'arrivée.</TransletText></p>
                        </AccordionItem>
                        <AccordionItem title={<TransletText>Est-il possible de réserver pour un groupe ?</TransletText>}>
                            <p><TransletText>Oui, pour les réservations de groupe (plus de 5 chambres), veuillez nous contacter directement via notre formulaire de contact pour obtenir un devis personnalisé.</TransletText></p>
                        </AccordionItem>
                    </Accordion>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4"><TransletText>Paiements</TransletText></h2>
                    <Accordion>
                        <AccordionItem title={<TransletText>Quels moyens de paiement acceptez-vous ?</TransletText>}>
                            <p><TransletText>Nous acceptons les principales cartes de crédit (Visa, MasterCard, American Express) ainsi que les paiements via PayPal et Apple Pay.</TransletText></p>
                        </AccordionItem>
                        <AccordionItem title={<TransletText>Le paiement est-il sécurisé ?</TransletText>}>
                            <p><TransletText>Absolument. Toutes les transactions sont sécurisées par un protocole de cryptage SSL pour garantir la confidentialité de vos données bancaires.</TransletText></p>
                        </AccordionItem>
                        <AccordionItem title={<TransletText>Quand serai-je débité ?</TransletText>}>
                            <p><TransletText>Le débit est généralement effectué au moment de la réservation. Pour certaines offres, un acompte peut être demandé, le solde étant à régler sur place.</TransletText></p>
                        </AccordionItem>
                        <AccordionItem title={<TransletText>Puis-je obtenir une facture ?</TransletText>}>
                            <p><TransletText>Oui, une facture est automatiquement générée et envoyée par email après votre séjour. Vous pouvez également la télécharger depuis votre espace client.</TransletText></p>
                        </AccordionItem>
                    </Accordion>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4"><TransletText>Votre Séjour</TransletText></h2>
                    <Accordion>
                        <AccordionItem title={<TransletText>Quels sont les horaires d'arrivée et de départ ?</TransletText>}>
                            <p><TransletText>Les arrivées se font généralement à partir de 15h00 et les départs doivent être effectués avant 11h00. Des horaires flexibles peuvent être arrangés sur demande et selon disponibilité.</TransletText></p>
                        </AccordionItem>
                        <AccordionItem title={<TransletText>Les animaux de compagnie sont-ils acceptés ?</TransletText>}>
                            <p><TransletText>Cela dépend de l'établissement. Cette information est précisée sur la fiche de chaque hébergement. Un supplément peut être demandé.</TransletText></p>
                        </AccordionItem>
                        <AccordionItem title={<TransletText>Le petit-déjeuner est-il inclus ?</TransletText>}>
                            <p><TransletText>Le petit-déjeuner est inclus dans certains tarifs. Veuillez vérifier les détails de votre offre lors de la réservation.</TransletText></p>
                        </AccordionItem>
                        <AccordionItem title={<TransletText>Y a-t-il un accès Wi-Fi ?</TransletText>}>
                            <p><TransletText>Oui, une connexion Wi-Fi haut débit est disponible gratuitement dans tous nos établissements.</TransletText></p>
                        </AccordionItem>
                        <AccordionItem title={<TransletText>Proposez-vous des lits bébé ?</TransletText>}>
                            <p><TransletText>Oui, des lits bébé sont disponibles sur demande. Merci de nous le préciser lors de votre réservation.</TransletText></p>
                        </AccordionItem>
                    </Accordion>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4"><TransletText>Compte et Confidentialité</TransletText></h2>
                    <Accordion>
                        <AccordionItem title={<TransletText>Comment créer un compte ?</TransletText>}>
                            <p><TransletText>Cliquez sur l'icône de profil en haut à droite, puis sur "S'inscrire". Remplissez le formulaire avec vos informations pour créer votre compte.</TransletText></p>
                        </AccordionItem>
                        <AccordionItem title={<TransletText>J'ai oublié mon mot de passe, que faire ?</TransletText>}>
                            <p><TransletText>Sur la page de connexion, cliquez sur "Mot de passe oublié". Vous recevrez un email pour réinitialiser votre mot de passe.</TransletText></p>
                        </AccordionItem>
                        <AccordionItem title={<TransletText>Comment mes données personnelles sont-elles utilisées ?</TransletText>}>
                            <p><TransletText>Vos données sont utilisées uniquement pour gérer vos réservations et améliorer nos services. Nous ne les partageons pas avec des tiers sans votre consentement. Consultez notre politique de confidentialité pour plus de détails.</TransletText></p>
                        </AccordionItem>
                    </Accordion>
                </section>
            </div>
        </div>
    );
}

