import { TransletText } from '@/app/lib/services/translation/transletText';

export default function LegalPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-6"><TransletText>Mentions Légales</TransletText></h1>
            <div className="prose max-w-none space-y-6">
                <section>
                    <h2 className="text-xl font-semibold mb-2"><TransletText>Éditeur du site</TransletText></h2>
                    <p><TransletText>Nom du projet : Evasion</TransletText></p>
                    <p><TransletText>Responsable de publication : [Nom du responsable]</TransletText></p>
                    <p><TransletText>Contact : [Adresse e-mail de contact]</TransletText></p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2"><TransletText>Hébergement</TransletText></h2>
                    <p><TransletText>Hébergeur : [Nom de l'hébergeur]</TransletText></p>
                    <p><TransletText>Adresse : [Adresse de l'hébergeur]</TransletText></p>
                    <p><TransletText>Téléphone : [Numéro de téléphone de l'hébergeur]</TransletText></p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2"><TransletText>Propriété intellectuelle</TransletText></h2>
                    <p><TransletText>L'ensemble du contenu présent sur ce site (textes, images, logos, etc.) est protégé par le droit d'auteur et reste la propriété exclusive du projet Evasion ou de ses partenaires.</TransletText></p>
                    <p><TransletText>Toute reproduction, distribution ou utilisation sans autorisation préalable est strictement interdite.</TransletText></p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2"><TransletText>Données personnelles</TransletText></h2>
                    <p><TransletText>Le projet Evasion s'engage à respecter la confidentialité des données personnelles collectées et à les utiliser uniquement dans le cadre prévu lors de la collecte.</TransletText></p>
                    <p><TransletText>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ces droits, contactez-nous à l'adresse indiquée ci-dessus.</TransletText></p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2"><TransletText>Cookies</TransletText></h2>
                    <p><TransletText>Ce site peut utiliser des cookies pour améliorer l'expérience utilisateur. En naviguant sur ce site, vous acceptez l'utilisation de cookies conformément à notre politique de confidentialité.</TransletText></p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2"><TransletText>Limitation de responsabilité</TransletText></h2>
                    <p><TransletText>Le projet Evasion décline toute responsabilité quant aux éventuels dommages pouvant résulter de l'accès ou de l'utilisation de ce site, y compris les dommages causés à votre ordinateur ou tout autre équipement.</TransletText></p>
                </section>
            </div>
        </div>
    );
}
