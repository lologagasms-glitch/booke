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
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-4xl font-extrabold mb-10 text-gray-900 tracking-tight">Validation des Paiements & Reçus</h1>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Client Info */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 pb-3">Informations Client</h2>
                        <div className="grid grid-cols-1 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Nom du Client</label>
                                <input
                                    type="text"
                                    name="clientName"
                                    value={formData.clientName}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                    placeholder="ex: Jean Dupont"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Client</label>
                                <input
                                    type="email"
                                    name="customerEmail"
                                    value={formData.customerEmail}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                    placeholder="client@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse Client</label>
                                <input
                                    type="text"
                                    name="customerAddress"
                                    value={formData.customerAddress}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                    placeholder="Adresse complète"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Référence</label>
                                <input
                                    type="text"
                                    name="reference"
                                    value={formData.reference}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-green-500 pb-3">Détails Paiement</h2>
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Montant</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 transition-all duration-200"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Devise</label>
                                <select
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 transition-all duration-200"
                                >
                                    <option value="EUR">EUR (€)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="GBP">GBP (£)</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* Service Details */}
                    <div className="space-y-6 md:col-span-2">
                        <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-purple-500 pb-3">Détails du Service</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Type de Service</label>
                                <input
                                    type="text"
                                    name="serviceType"
                                    value={formData.serviceType}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-all duration-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Date d'arrivée</label>
                                <input
                                    type="date"
                                    name="checkInDate"
                                    value={formData.checkInDate}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-all duration-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Date de départ</label>
                                <input
                                    type="date"
                                    name="checkOutDate"
                                    value={formData.checkOutDate}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-all duration-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Voyageurs</label>
                                <input
                                    type="number"
                                    name="guests"
                                    value={formData.guests}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-all duration-200"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Nom du Directeur (Signature)</label>
                            <input
                                type="text"
                                name="managerName"
                                value={formData.managerName}
                                onChange={handleChange}
                                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-all duration-200"
                                placeholder="ex: Ghislain K."
                            />
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-6 md:col-span-2">
                        <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-orange-500 pb-3">Détails & Options</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Moyen de Paiement</label>
                                <select
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition-all duration-200"
                                >
                                    <option value="Carte Bancaire">Carte Bancaire</option>
                                    <option value="Virement">Virement</option>
                                    <option value="Espèces">Espèces</option>
                                    <option value="PayPal">PayPal</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Statut</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition-all duration-200"
                                >
                                    <option value="Validé">Validé</option>
                                    <option value="En attente">En attente</option>
                                    <option value="Remboursé">Remboursé</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition-all duration-200"
                            />
                        </div>
                    </div>

                    {/* Generation Options */}
                    <div className="space-y-6 md:col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 shadow-inner">
                        <h2 className="text-xl font-bold text-blue-900">Génération du Document</h2>
                        <div className="flex items-center gap-6">
                            <div className="flex-1">
                                <label className="block text-sm font-semibold text-blue-900 mb-2">Langue du document</label>
                                <select
                                    name="targetLanguage"
                                    value={formData.targetLanguage}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border-blue-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 transition-all duration-200"
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
                            <div className="flex-none pt-8">
                                {!pdfLabels ? (
                                    <button
                                        onClick={generatePdf}
                                        disabled={isGenerating || !formData.clientName || !formData.amount}
                                        className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        {isGenerating ? 'Traduction...' : 'Préparer le PDF'}
                                    </button>
                                ) : (
                                    <PDFDownloadLink
                                        document={<PaymentReceiptPdf data={formData} labels={pdfLabels} />}
                                        fileName={`recu-${formData.reference}.pdf`}
                                        className="inline-flex items-center gap-3 px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        {({ loading }: { loading: boolean }) => (
                                            <>
                                                <ArrowDownTrayIcon className="w-6 h-6" />
                                                {loading ? 'Génération...' : 'Télécharger le PDF'}
                                            </>
                                        )}
                                    </PDFDownloadLink>
                                )}
                            </div>
                        </div>
                        {pdfLabels && (
                            <p className="text-sm text-green-800 mt-3 font-semibold">
                                ✓ Document prêt et traduit en {formData.targetLanguage.toUpperCase()}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
