'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PaymentReceiptPdf from '@/components/admin/PaymentReceiptPdf';
import { traduireTexteSecurise } from '@/app/lib/services/translation/translateApiWithLingvaAndVercel';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import QRCode from 'qrcode';

export default function AdminPaymentsPage() {
    const t = useTranslations('common');
    const [formData, setFormData] = useState({
        clientName: '',
        customerEmail: '',
        customerAddress: '',
        amount: '',
        currency: 'EUR',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Carte Bancaire',
        status: 'Validé',
        description: 'Réservation de séjour',
        reference: `REF-${Date.now()}`,
        companyName: 'Évasion',
        companyAddress: '123 Avenue des Champs-Élysées, 75008 Paris, France',
        companyPhone: '+33 1 23 45 67 89',
        companyEmail: 'contact@evasion.com',
        serviceType: 'Hébergement',
        checkInDate: new Date().toISOString().split('T')[0],
        checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        guests: '2',
        managerName: 'Ghislain K.',
        targetLanguage: 'fr',
    });

    const [pdfLabels, setPdfLabels] = useState<any>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setPdfLabels(null); // Reset PDF when data changes
    };

    const generatePdf = async () => {
        setIsGenerating(true);
        try {
            const lang = formData.targetLanguage;

            // Generate QR Code
            const qrData = JSON.stringify({
                ref: formData.reference,
                amount: `${formData.amount} ${formData.currency}`,
                date: formData.date,
                client: formData.clientName
            });
            const qrCodeUrl = await QRCode.toDataURL(qrData);

            // Translate labels
            const labels = {
                title: await traduireTexteSecurise('Reçu de Paiement', 'fr', lang) || 'Payment Receipt',
                client: await traduireTexteSecurise('Client', 'fr', lang) || 'Client',
                clientInfo: await traduireTexteSecurise('Informations Client', 'fr', lang) || 'Client Info',
                companyInfo: await traduireTexteSecurise('Émetteur', 'fr', lang) || 'Issuer',
                date: await traduireTexteSecurise('Date', 'fr', lang) || 'Date',
                method: await traduireTexteSecurise('Moyen de paiement', 'fr', lang) || 'Payment Method',
                status: await traduireTexteSecurise('Statut', 'fr', lang) || 'Status',
                description: await traduireTexteSecurise('Description', 'fr', lang) || 'Description',
                reference: await traduireTexteSecurise('Référence', 'fr', lang) || 'Reference',
                serviceDetails: await traduireTexteSecurise('Détails du Service', 'fr', lang) || 'Service Details',
                checkIn: await traduireTexteSecurise('Arrivée', 'fr', lang) || 'Check-in',
                checkOut: await traduireTexteSecurise('Départ', 'fr', lang) || 'Check-out',
                guests: await traduireTexteSecurise('Voyageurs', 'fr', lang) || 'Guests',
                manager: await traduireTexteSecurise('Directeur Général', 'fr', lang) || 'General Manager',
                total: await traduireTexteSecurise('Total', 'fr', lang) || 'Total',
                footer: await traduireTexteSecurise('Merci de votre confiance. Ce document est une preuve de paiement.', 'fr', lang) || 'Thank you for your trust.',
            };

            setPdfLabels({ ...labels, qrCodeUrl });
        } catch (error) {
            console.error('Error translating labels:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Validation des Paiements & Reçus</h1>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Client Info */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Informations Client</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Client</label>
                                <input
                                    type="text"
                                    name="clientName"
                                    value={formData.clientName}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="ex: Jean Dupont"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Client</label>
                                <input
                                    type="email"
                                    name="customerEmail"
                                    value={formData.customerEmail}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="client@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse Client</label>
                                <input
                                    type="text"
                                    name="customerAddress"
                                    value={formData.customerAddress}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Adresse complète"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Référence</label>
                                <input
                                    type="text"
                                    name="reference"
                                    value={formData.reference}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Détails Paiement</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
                                <select
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="EUR">EUR (€)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="GBP">GBP (£)</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Service Details */}
                    <div className="space-y-4 md:col-span-2">
                        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Détails du Service</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type de Service</label>
                                <input
                                    type="text"
                                    name="serviceType"
                                    value={formData.serviceType}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date d'arrivée</label>
                                <input
                                    type="date"
                                    name="checkInDate"
                                    value={formData.checkInDate}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date de départ</label>
                                <input
                                    type="date"
                                    name="checkOutDate"
                                    value={formData.checkOutDate}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Voyageurs</label>
                                <input
                                    type="number"
                                    name="guests"
                                    value={formData.guests}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Directeur (Signature)</label>
                            <input
                                type="text"
                                name="managerName"
                                value={formData.managerName}
                                onChange={handleChange}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="ex: Ghislain K."
                            />
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-4 md:col-span-2">
                        <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Détails & Options</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Moyen de Paiement</label>
                                <select
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="Carte Bancaire">Carte Bancaire</option>
                                    <option value="Virement">Virement</option>
                                    <option value="Espèces">Espèces</option>
                                    <option value="PayPal">PayPal</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="Validé">Validé</option>
                                    <option value="En attente">En attente</option>
                                    <option value="Remboursé">Remboursé</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Generation Options */}
                    <div className="space-y-4 md:col-span-2 bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h2 className="text-lg font-semibold text-blue-800">Génération du Document</h2>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-blue-900 mb-1">Langue du document</label>
                                <select
                                    name="targetLanguage"
                                    value={formData.targetLanguage}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="fr">Français</option>
                                    <option value="en">Anglais</option>
                                    <option value="es">Espagnol</option>
                                    <option value="de">Allemand</option>
                                    <option value="it">Italien</option>
                                    <option value="pt">Portugais</option>
                                    <option value="ru">Russe</option>
                                    <option value="zh">Chinois</option>
                                    <option value="ja">Japonais</option>
                                </select>
                            </div>
                            <div className="flex-none pt-6">
                                {!pdfLabels ? (
                                    <button
                                        onClick={generatePdf}
                                        disabled={isGenerating || !formData.clientName || !formData.amount}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isGenerating ? 'Traduction...' : 'Préparer le PDF'}
                                    </button>
                                ) : (
                                    <PDFDownloadLink
                                        document={<PaymentReceiptPdf data={formData} labels={pdfLabels} />}
                                        fileName={`recu-${formData.reference}.pdf`}
                                        className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                                    >
                                        {({ loading }: { loading: boolean }) => (
                                            <>
                                                <ArrowDownTrayIcon className="w-5 h-5" />
                                                {loading ? 'Génération...' : 'Télécharger le PDF'}
                                            </>
                                        )}
                                    </PDFDownloadLink>
                                )}
                            </div>
                        </div>
                        {pdfLabels && (
                            <p className="text-sm text-green-700 mt-2">
                                ✓ Document prêt et traduit en {formData.targetLanguage.toUpperCase()}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
