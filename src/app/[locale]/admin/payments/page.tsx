'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PaymentReceiptPdf from '@/components/admin/PaymentReceiptPdf';
import { traduireTexteSecurise } from '@/app/lib/services/translation/translateApiWithLingvaAndVercel';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import QRCode from 'qrcode';

// Composant de champ réutilisable avec label flottant
const ModernInput = ({ 
  id, 
  label, 
  type = 'text', 
  icon, 
  required = false, 
  className = '', 
  ...props 
}: any) => (
  <div className="relative group">
    <input
      id={id}
      type={type}
      className={`peer w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl 
        text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-500 
        focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-300 
        transform focus:scale-105 hover:border-gray-300 ${className}`}
      placeholder=" "
      {...props}
    />
    <label 
      htmlFor={id}
      className={`absolute left-4 top-4 text-gray-500 transition-all duration-300 
        pointer-events-none origin-left peer-focus:-translate-y-3 peer-focus:scale-90 
        peer-focus:text-blue-600 peer-focus:font-semibold
        peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 
        peer-placeholder-shown:text-gray-400 peer-not-placeholder-shown:-translate-y-3 
        peer-not-placeholder-shown:scale-90 peer-not-placeholder-shown:text-blue-600`}
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {icon && (
      <div className="absolute right-4 top-4 text-gray-400 transition-all duration-300 
        group-focus-within:text-blue-500 group-focus-within:scale-110">
        {icon}
      </div>
    )}
  </div>
);

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
        companyAddress: '46 Avenue de Trévise, 75009 Paris, France',
        companyPhone: '+33 780 997 572',
        companyEmail: 'Evasionsms@evasion.com',
        serviceType: 'paiement de séjour',
        checkInDate: new Date().toISOString().split('T')[0],
        checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        guests: '2',
        managerName: 'Jean Dupont',
        targetLanguage: 'fr',
    });

    const [pdfLabels, setPdfLabels] = useState<any>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setPdfLabels(null);
    };

    const generatePdf = async () => {
        setIsGenerating(true);
        try {
            const lang = formData.targetLanguage;
            const qrData = JSON.stringify({
                ref: formData.reference,
                amount: `${formData.amount} ${formData.currency}`,
                date: formData.date,
                client: formData.clientName
            });
            const qrCodeUrl = await QRCode.toDataURL(qrData);

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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                {/* En-tête avec effet glassmorphism */}
                <div className="relative mb-10 bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 p-8 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Validation des Paiements & Reçus
                    </h1>
                    <p className="text-gray-600 mt-2">Générez des reçus professionnels avec traduction automatique</p>
                </div>

                {/* Formulaire avec effet glassmorphism */}
                <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Section Client */}
                        <div className="space-y-6 transform transition-transform hover:scale-[1.01]">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold">1</span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Informations Client</h2>
                            </div>
                            <div className="grid grid-cols-1 gap-5">
                                <ModernInput
                                    id="clientName"
                                    name="clientName"
                                    label="Nom du Client"
                                    value={formData.clientName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Jean Dupont"
                                />
                                <ModernInput
                                    id="customerEmail"
                                    name="customerEmail"
                                    type="email"
                                    label="Email Client"
                                    value={formData.customerEmail}
                                    onChange={handleChange}
                                    placeholder="client@example.com"
                                />
                                <ModernInput
                                    id="customerAddress"
                                    name="customerAddress"
                                    label="Adresse du Client"
                                    value={formData.customerAddress}
                                    onChange={handleChange}
                                    placeholder="123 Rue de Paris, 75001 Paris"
                                />
                                <ModernInput
                                    id="reference"
                                    name="reference"
                                    label="Référence"
                                    value={formData.reference}
                                    onChange={handleChange}
                                    placeholder="REF-2024-001"
                                />
                            </div>
                        </div>

                        {/* Section Paiement */}
                        <div className="space-y-6 transform transition-transform hover:scale-[1.01]">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold">2</span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Détails du Paiement</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <ModernInput
                                        id="amount"
                                        name="amount"
                                        type="number"
                                        label="Montant"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        required
                                        placeholder="150.00"
                                        className="pr-12"
                                    />
                                    <div className="absolute right-4 top-4 text-gray-400 pointer-events-none">€</div>
                                </div>
                                <div className="relative">
                                    <select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleChange}
                                        className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl 
                                            text-gray-900 focus:outline-none focus:border-green-500 focus:bg-white 
                                            focus:ring-4 focus:ring-green-100 transition-all duration-300 
                                            transform focus:scale-105 hover:border-gray-300 appearance-none"
                                    >
                                        <option value="EUR">EUR (€)</option>
                                        <option value="USD">USD ($)</option>
                                        <option value="GBP">GBP (£)</option>
                                    </select>
                                    <div className="absolute right-4 top-4 pointer-events-none text-gray-400">
                                        ▼
                                    </div>
                                </div>
                            </div>
                            <ModernInput
                                id="date"
                                name="date"
                                type="date"
                                label="Date du Paiement"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Section Service */}
                        <div className="space-y-6 md:col-span-2 transform transition-transform hover:scale-[1.01]">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold">3</span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Détails du Service</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <ModernInput
                                    id="serviceType"
                                    name="serviceType"
                                    label="Type de Service"
                                    value={formData.serviceType}
                                    onChange={handleChange}
                                    placeholder="Hébergement"
                                />
                                <ModernInput
                                    id="checkInDate"
                                    name="checkInDate"
                                    type="date"
                                    label="Date d'arrivée"
                                    value={formData.checkInDate}
                                    onChange={handleChange}
                                    required
                                />
                                <ModernInput
                                    id="checkOutDate"
                                    name="checkOutDate"
                                    type="date"
                                    label="Date de départ"
                                    value={formData.checkOutDate}
                                    onChange={handleChange}
                                    required
                                />
                                <div className="md:col-span-1">
                                    <ModernInput
                                        id="guests"
                                        name="guests"
                                        type="number"
                                        label="Nombre de Voyageurs"
                                        value={formData.guests}
                                        onChange={handleChange}
                                        placeholder="2"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <ModernInput
                                        id="managerName"
                                        name="managerName"
                                        label="Nom du Directeur"
                                        value={formData.managerName}
                                        onChange={handleChange}
                                        placeholder="Ghislain K."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section Options */}
                        <div className="space-y-6 md:col-span-2 transform transition-transform hover:scale-[1.01]">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold">4</span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Options & Configuration</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative">
                                    <select
                                        name="paymentMethod"
                                        value={formData.paymentMethod}
                                        onChange={handleChange}
                                        className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl 
                                            text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white 
                                            focus:ring-4 focus:ring-orange-100 transition-all duration-300 
                                            transform focus:scale-105 hover:border-gray-300 appearance-none"
                                    >
                                        <option value="Carte Bancaire">Carte Bancaire</option>
                                        <option value="Virement">Virement</option>
                                        <option value="Espèces">Espèces</option>
                                        <option value="PayPal">PayPal</option>
                                    </select>
                                    <label className="absolute -top-3 left-3 px-2 bg-white text-sm font-semibold text-orange-600">
                                        Moyen de Paiement
                                    </label>
                                    <div className="absolute right-4 top-4 pointer-events-none text-gray-400">
                                        ▼
                                    </div>
                                </div>
                                <div className="relative">
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl 
                                            text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white 
                                            focus:ring-4 focus:ring-orange-100 transition-all duration-300 
                                            transform focus:scale-105 hover:border-gray-300 appearance-none"
                                    >
                                        <option value="Validé">✅ Validé</option>
                                        <option value="En attente">⏳ En attente</option>
                                        <option value="Remboursé">🔙 Remboursé</option>
                                    </select>
                                    <label className="absolute -top-3 left-3 px-2 bg-white text-sm font-semibold text-orange-600">
                                        Statut du Paiement
                                    </label>
                                    <div className="absolute right-4 top-4 pointer-events-none text-gray-400">
                                        ▼
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description du Service</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl 
                                        text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 
                                        focus:bg-white focus:ring-4 focus:ring-orange-100 transition-all duration-300 
                                        transform focus:scale-[1.02] hover:border-gray-300"
                                    placeholder="Décrivez le service ou la réservation..."
                                />
                            </div>
                        </div>

                        {/* Section Génération */}
                        <div className="space-y-6 md:col-span-2 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 p-8 rounded-3xl border border-blue-200/50 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                                    <ArrowDownTrayIcon className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-blue-900">Génération du Document</h2>
                            </div>
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-blue-900 mb-3">
                                        🌐 Langue du document
                                    </label>
                                    <select
                                        name="targetLanguage"
                                        value={formData.targetLanguage}
                                        onChange={handleChange}
                                        className="w-full px-4 py-4 bg-white/80 border-2 border-blue-300 rounded-2xl 
                                            text-blue-900 focus:outline-none focus:border-blue-600 focus:bg-white 
                                            focus:ring-4 focus:ring-blue-200 transition-all duration-300 
                                            transform focus:scale-105 hover:border-blue-400 appearance-none"
                                    >
                                        <option value="fr">🇫🇷 Français</option>
                                        <option value="en">🇬🇧 Anglais</option>
                                        <option value="es">🇪🇸 Espagnol</option>
                                        <option value="de">🇩🇪 Allemand</option>
                                        <option value="it">🇮🇹 Italien</option>
                                        <option value="pt">🇵🇹 Portugais</option>
                                        <option value="ru">🇷🇺 Russe</option>
                                        <option value="zh">🇨🇳 Chinois</option>
                                        <option value="ja">🇯🇵 Japonais</option>
                                    </select>
                                </div>
                                <div className="flex-none w-full md:w-auto">
                                    {!pdfLabels ? (
                                        <button
                                            onClick={generatePdf}
                                            disabled={isGenerating || !formData.clientName || !formData.amount}
                                            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 
                                                text-white rounded-2xl font-bold hover:from-blue-700 hover:to-blue-800 
                                                disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 
                                                shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:hover:translate-y-0"
                                        >
                                            <span className="inline-flex items-center gap-3">
                                                {isGenerating ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        Préparation...
                                                    </>
                                                ) : (
                                                    '📄 Préparer le PDF'
                                                )}
                                            </span>
                                        </button>
                                    ) : (
                                        <PDFDownloadLink
                                            document={<PaymentReceiptPdf data={formData} labels={pdfLabels} />}
                                            fileName={`recu-${formData.reference}.pdf`}
                                            className="inline-flex w-full md:w-auto items-center justify-center gap-3 px-8 py-4 
                                                bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl font-bold 
                                                hover:from-green-700 hover:to-green-800 transition-all duration-300 
                                                shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                                        >
                                            {({ loading }: { loading: boolean }) => (
                                                <>
                                                    <ArrowDownTrayIcon className="w-6 h-6" />
                                                    {loading ? '⏳ Génération...' : '💾 Télécharger le PDF'}
                                                </>
                                            )}
                                        </PDFDownloadLink>
                                    )}
                                </div>
                            </div>
                            {pdfLabels && (
                                <div className="mt-4 p-4 bg-green-100/80 border border-green-300 rounded-2xl">
                                    <p className="text-sm text-green-800 font-semibold flex items-center gap-2">
                                        <span className="text-xl">✨</span>
                                        Document prêt et traduit en 
                                        <span className="px-3 py-1 bg-green-200 rounded-full font-bold">
                                            {formData.targetLanguage.toUpperCase()}
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}