import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font, Svg, Path, G, Rect } from '@react-pdf/renderer';

// Register fonts
Font.register({
    family: 'Helvetica-Bold',
    src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfA.ttf'
});

// Styles modernisés
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#F7F7F7', // Fond légèrement gris
        padding: 40,
        fontFamily: 'Helvetica',
        color: '#1F2937', // Gris foncé (Gray-800) pour le texte principal
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        paddingBottom: 20,
        borderBottomWidth: 4,
        borderBottomColor: '#10B981', // Émeraude pour une touche moderne
    },
    logoContainer: {
        flexDirection: 'column',
    },
    logoPlaceholder: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#10B981',
        marginBottom: 8,
    },
    companyInfo: {
        fontSize: 10,
        color: '#6B7280', // Gris moyen
        lineHeight: 1.4,
    },
    invoiceTitleContainer: {
        alignItems: 'flex-end',
    },
    invoiceTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    invoiceMeta: {
        flexDirection: 'row',
        marginBottom: 4,
        alignItems: 'center',
    },
    metaLabel: {
        fontSize: 10,
        color: '#4B5563', // Gris-600
        width: 100, // Augmenté pour l'alignement
        textAlign: 'right',
        marginRight: 10,
        fontWeight: 'bold',
    },
    metaValue: {
        fontSize: 10,
        color: '#111827',
        textAlign: 'right',
    },
    statusBadge: {
        marginTop: 15,
        paddingVertical: 4,
        paddingHorizontal: 12,
        backgroundColor: '#34D399', // Teinte plus claire d'Émeraude
        borderRadius: 4,
        alignSelf: 'flex-end',
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    content: {
        flex: 1,
    },
    // Section d'informations Client/Émetteur
    infoSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    infoBlock: {
        width: '48%',
    },
    infoLabel: {
        fontSize: 11,
        color: '#6B7280',
        marginBottom: 8,
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    infoText: {
        fontSize: 12,
        color: '#1F2937',
        marginBottom: 3,
    },

    // Détails du Service (Table)
    table: {
        marginBottom: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#10B981', // Couleur principale
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    tableHeaderCell: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textTransform: 'uppercase',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        backgroundColor: '#FFFFFF',
    },
    tableCell: {
        fontSize: 11,
        color: '#1F2937',
    },
    col1: { width: '40%' },
    col2: { width: '20%', textAlign: 'center' },
    col3: { width: '20%', textAlign: 'center' },
    col4: { width: '20%', textAlign: 'right' },

    // Détails Paiement & Total
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 30,
    },
    totalBox: {
        width: '45%',
        padding: 15,
        backgroundColor: '#E0F2F1', // Fond clair pour le total
        borderRadius: 8,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    totalLabel: {
        fontSize: 12,
        color: '#047857', // Vert foncé
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 12,
        color: '#065F46', // Vert très foncé
        fontWeight: 'bold',
    },
    grandTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#A7F3D0',
    },
    grandTotalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#065F46',
    },
    grandTotalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#10B981',
    },

    // QR et Signature (en bas à gauche/droite)
    bottomSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 'auto', // Pousse cette section vers le bas
        paddingTop: 30,
    },
    qrCode: {
        width: 80,
        height: 80,
        marginBottom: 10,
    },
    signatureContainer: {
        width: 200,
        alignItems: 'center',
    },
    signatureLine: {
        width: '100%',
        borderBottomWidth: 2,
        borderBottomColor: '#1F2937',
        marginBottom: 8,
    },
    signatureLabel: {
        fontSize: 10,
        color: '#6B7280',
        marginBottom: 4,
    },
    signatureName: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        color: '#1F2937',
    },
    footer: {
        marginTop: 20,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        textAlign: 'center',
    },
    footerText: {
        fontSize: 9,
        color: '#9CA3AF',
        lineHeight: 1.4,
    },
});

interface PaymentReceiptProps {
    data: {
        clientName: string;
        customerEmail?: string;
        customerAddress?: string;
        amount: string;
        currency: string;
        date: string;
        paymentMethod: string;
        status: string;
        description: string;
        reference: string;
        companyName?: string;
        companyAddress?: string;
        companyPhone?: string;
        companyEmail?: string;
        serviceType?: string;
        checkInDate?: string;
        checkOutDate?: string;
        guests?: string;
        managerName?: string;
    };
    labels: {
        title: string;
        client: string;
        clientInfo: string;
        companyInfo: string;
        date: string;
        method: string;
        status: string;
        description: string;
        reference: string;
        serviceDetails: string;
        checkIn: string;
        checkOut: string;
        guests: string;
        manager: string;
        total: string;
        footer: string;
        qrCodeUrl?: string;
    };
}

// Fonction utilitaire pour générer une signature procédurale (comme dans l'original)
const generateSignaturePath = (name: string) => {
    // Le SVG initial dans l'ancienne version était trop grand, 
    // laissons un path SVG simple ou un path procédural comme celui-ci.
    let seed = 0;
    for (let i = 0; i < name.length; i++) {
        seed += name.charCodeAt(i);
    }
    const random = () => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };

    let path = "M 10 40 ";
    let x = 10;
    let y = 40;

    path += `C ${x + 5} ${y - 10 - random() * 20}, ${x + 10} ${y + 10 + random() * 10}, ${x + 20} ${y - 5} `;
    x += 20;

    for (let i = 0; i < name.length; i++) {
        const char = name[i];
        const width = 10 + random() * 10;
        const height = 15 + random() * 15;
        const yOffset = (random() - 0.5) * 10;

        if (char === ' ') {
            x += 15;
            continue;
        }

        const cp1x = x + width * 0.2;
        const cp1y = y - height;
        const cp2x = x + width * 0.8;
        const cp2y = y - height;

        const endX = x + width;
        const endY = y + yOffset;

        path += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY} `;
        x = endX;
    }

    path += `C ${x + 20} ${y - 10}, ${x + 40} ${y + 5}, ${x + 60} ${y - 5}`;

    return path;
};

const Watermark = () => (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', opacity: 0.03 }}>
        <Svg viewBox="0 0 595.28 841.89" width={500} height={700}>
            <G>
                <Path fill="#FFED00" d="M524.26,419.9c0.26,29.31-4.84,57.69-15.64,84.92c-12.55,31.64-31.37,59.04-56.69,81.93c-28,25.31-60.41,42.25-97.02,51.13c-26.27,6.38-52.88,7.89-79.76,4.88c-24.82-2.78-48.56-9.41-71.09-20.1c-39.28-18.63-70.61-46.32-93.41-83.41c-16.85-27.42-27.13-57.2-31.13-89.16c-4.75-37.91,0.18-74.59,14-110.08c7.96-20.44,19-39.14,32.68-56.34c12.63-15.88,27.21-29.62,43.61-41.46c24.69-17.82,52.02-29.94,81.67-36.66c20.55-4.66,41.43-6.42,62.48-5.11c38.09,2.37,73.6,13.26,106.05,33.43c36.65,22.77,64.17,53.89,82.72,92.77C516.83,356.21,523.7,387.03,524.26,419.9z M482.74,394.37c-0.59-6.87-0.95-13.77-1.82-20.61c-3.24-25.5-12.2-48.9-26.6-70.17c-15.49-22.87-35.59-40.76-59.73-54.07c-33.89-18.68-70.26-26.31-108.78-23.4c-32.43,2.45-62.38,12.43-89.66,30.28c-17.08,11.18-31.93,24.71-44.03,41.17c-27.03,36.76-37.35,77.8-30.22,122.84c6.34,40.04,25.99,72.91,56.5,99.28c20.02,17.31,43.04,29.25,68.52,36.55c28.92,8.28,58.21,9.7,87.77,4.73c27.18-4.57,52.19-14.7,74.91-30.45c20.73-14.38,37.68-32.27,50.45-54.02C474.89,451.18,482.24,423.76,482.74,394.37z M424.92,545.43c3.87,5.02,7.53,9.76,11.6,15.05c-1.89-0.34-3.12-0.49-4.32-0.78c-6.05-1.46-12.08-2.97-18.13-4.41c-0.65-0.15-1.57-0.17-2.07,0.17c-1.64,1.14-3.14,2.48-4.9,3.9c6.65,8.7,13.21,17.28,19.94,26.09c2.19-1.74,4.11-3.27,6.04-4.8c-3.95-5.33-7.63-10.28-11.71-15.78c1.24,0.22,1.72,0.27,2.18,0.38c6.05,1.45,12.18,2.63,18.12,4.45c4.23,1.29,6.65-0.55,9.18-3.77c-6.65-8.43-13.3-16.86-20.05-25.42C428.75,542.24,426.96,543.73,424.92,545.43z M173.01,550.85c4.44,3.28,8.68,6.41,13.17,9.72c1.35-1.82,2.56-3.45,3.85-5.19c-6.44-4.99-12.58-9.75-18.93-14.66c-7.08,8.63-13.93,16.99-20.9,25.5c6.86,5.44,13.43,10.66,20.26,16.08c1.39-1.83,2.67-3.5,4.01-5.25c-4.78-3.8-9.23-7.35-13.78-10.96c0.45-0.57,0.8-1.03,1.17-1.47c3.35-3.94,3.35-3.93,7.48-0.68c2.55,2,5.14,3.96,7.86,6.06c1.37-1.81,2.5-3.3,3.7-4.89c-4.15-3.16-8.06-6.14-12.14-9.25C170.29,554.04,171.58,552.53,173.01,550.85z M314.5,593.55c-5.59-3.28-11.27-4.34-17.26-3.1c-5.58,1.15-8.6,5.18-8.31,10.66c0.25,4.56,3.2,6.86,7.09,8.18c2.86,0.97,5.89,1.44,8.69,2.54c1.08,0.42,2.42,1.95,2.4,2.96c-0.01,0.98-1.45,2.35-2.55,2.78c-1.32,0.51-3.04,0.53-4.43,0.17c-2.89-0.74-5.68-1.87-8.82-2.95c-1.03,1.38-2.26,3.01-3.57,4.77c6.65,5.05,13.62,6.46,21.18,3.81c4.13-1.45,6.25-4.72,6.5-9.07c0.23-3.97-1.86-6.92-6.01-8.71c-1.23-0.53-2.53-0.89-3.82-1.27c-2.01-0.6-4.06-1.07-6.05-1.75c-1.48-0.5-2.82-1.29-2.58-3.23c0.24-1.99,1.79-2.83,3.38-2.75c2.47,0.11,4.94,0.69,7.37,1.24c1.17,0.27,2.26,0.92,3.44,1.43C312.33,597.24,313.35,595.52,314.5,593.55z M201.54,563.82c-0.18,1.24-0.37,2.14-0.42,3.05c-0.5,9.17-1.02,18.33-1.44,27.5c-0.25,5.46-0.13,5.38,4.75,7.76c1.67,0.81,2.72,0.51,3.96-0.71c4.45-4.36,9.04-8.57,13.47-12.94c3.41-3.36,6.68-6.86,10.2-10.51c-2.07-0.92-4.16-1.95-6.33-2.75c-0.49-0.18-1.45,0.29-1.91,0.74c-4.31,4.26-8.55,8.59-12.82,12.89c-1.02,1.03-2.06,2.05-3.57,3.56c0-1.56-0.05-2.37,0.01-3.17c0.42-5.54,0.8-11.09,1.32-16.62c0.49-5.24,0.56-5.24-4.12-7.42C203.73,564.79,202.81,564.39,201.54,563.82z M333.44,587.92c2.11,10.97,4.16,21.65,6.28,32.68c2.68-0.51,5.1-0.96,7.83-1.48c-2.09-10.68-4.11-21.05-6.22-31.4c-0.09-0.45-1.06-1.08-1.55-1.02C337.73,586.96,335.71,587.46,333.44,587.92z" />
                <Path fill="#BE1622" d="M282.33,340.35c5.78,0,11.16,0,16.53,0c16.08,0.01,32.16,0.06,48.24-0.03c2.28-0.01,2.82,0.74,2.81,2.9c-0.05,31.66-0.02,63.32-0.01,94.98c0,8.5-0.03,17.01,0.07,25.51c0.02,1.83-0.44,2.5-2.38,2.49c-20.97-0.05-41.93-0.06-62.9,0.04c-2.71,0.01-2.46-1.55-2.46-3.23c0.01-18.94,0.03-37.89,0.04-56.83c0.02-20.8,0.03-41.59,0.05-62.39C282.33,342.79,282.33,341.8,282.33,340.35z" />
                <Path fill="#BE1622" d="M267.03,466.04c-8.12,0.55-15.21-0.51-21.1-5.76c-5.06-4.51-7.64-10.17-7.65-16.94c-0.03-26.17-0.01-52.35-0.05-78.52c-0.02-9.81,4.12-17.18,12.7-21.92c4.49-2.48,9.46-2.87,14.47-2.41c0.59,0.05,1.48,1.45,1.51,2.25c0.17,3.95,0.1,7.91,0.1,11.87c0.01,35.61,0.02,71.22,0.02,106.84C267.03,462.94,267.03,464.43,267.03,466.04z" />
                <Path fill="#BE1622" d="M365.11,466.07c0-1.96,0-3.79,0-5.62c0.02-35.45,0.04-70.9,0.06-106.35c0-3.87,0.02-7.75-0.01-11.62c-0.01-1.21,0.1-2.04,1.69-2.13c10.35-0.61,18.64,2.78,24.06,12.01c2.11,3.59,2.95,7.52,2.96,11.59c0.04,25.68-0.01,51.37,0.02,77.05c0.01,8.29-2.52,15.37-9.33,20.53C378.84,465.86,372.28,466.56,365.11,466.07z" />
                <Path fill="#BE1622" d="M221.71,390.53c-5.52,1.74-10.47,3.31-15.42,4.85c-9.38,2.93-18.77,5.83-28.15,8.77c-1.16,0.36-2.06,0.8-3.02-0.59c-7.91-11.59-15.9-23.13-23.85-34.69c-0.7-1.02-1.33-2.08-2.26-3.52c4.84-1.47,9.41-2.57,13.76-4.24c5.77-2.21,10.13,0.38,14.79,3.19C192,373.05,206.58,381.57,221.71,390.53z" />
                <Path fill="#BE1622" d="M229.28,397.45c0,10.61,0,20.91,0,31.62c-3.86-0.63-7.64-1.23-11.42-1.85c-9.13-1.49-18.26-2.99-27.39-4.49c-7.38-1.22-14.76-2.43-22.13-3.7c-0.74-0.13-1.41-0.66-2.11-1c0.67-0.63,1.23-1.59,2.01-1.84c8.81-2.82,17.65-5.54,26.49-8.25c10.45-3.21,20.91-6.38,31.36-9.57C227.03,398.07,227.99,397.81,229.28,397.45z" />
                <Path fill="#BE1622" d="M402.63,376.53c-0.19-10.01,1.09-20.02-5.05-29.08c6.06-1.78,11.66-3.46,17.28-5.07c6.61-1.89,13.22-3.83,19.88-5.54c3.24-0.83,6.24,0,8.3,2.83c2.07,2.86,1.8,6.09,0,8.77c-1.83,2.72-4,5.54-6.68,7.3c-10.74,7.05-21.74,13.7-32.65,20.5C403.52,376.36,403.25,376.37,402.63,376.53z" />
                <Path fill="#BE1622" d="M315.71,307.55c4.38,0,8.76-0.05,13.13,0.01c7.7,0.11,13.34,5.68,13.57,13.38c0.08,2.86-0.05,5.73,0.07,8.59c0.06,1.44-0.49,2.02-1.83,2.06c-0.08,0-0.17,0.01-0.25,0.02c-7.38,0.7-7.38,0.7-7.21-6.65c0.12-5.55-2.66-8.38-8.28-8.38c-6.4,0-12.8-0.03-19.19,0.02c-4.14,0.04-7.05,2.98-7.18,7.17c-0.06,1.93,0.06,3.88-0.06,5.81c-0.04,0.61-0.56,1.67-0.94,1.71c-2.25,0.21-4.53,0.25-6.79,0.18c-0.43-0.01-1.21-0.81-1.2-1.24c0.04-4.11-0.25-8.3,0.47-12.31c1.1-6.2,6.06-10.09,12.31-10.3c4.46-0.15,8.92-0.03,13.38-0.03C315.71,307.56,315.71,307.56,315.71,307.55z" />
                <Path fill="#BE1622" d="M284.32,483.4c0.05,5.13-4.42,9.59-9.68,9.65c-5.89,0.07-10.19-4.22-10.19-10.18c0-4.97,4.65-9.41,9.93-9.49C280.18,473.3,284.26,477.41,284.32,483.4z" />
                <Path fill="#BE1622" d="M358.16,473.42c5.77-0.01,9.77,4.2,9.74,10.24c-0.03,5.07-4.61,9.36-9.95,9.32c-5.7-0.04-9.92-4.25-9.88-9.86C348.09,477.6,352.44,473.42,358.16,473.42z" />
            </G>
        </Svg>
    </View>
);

const PaymentReceiptPdf: React.FC<PaymentReceiptProps> = ({ data, labels }) => {
    const PEN_BLUE = '#0a1f44';
    const ACCENT = '#00d4aa';
    const signaturePath = data.managerName ? generateSignaturePath(data.managerName) : "";

    // Détermine si le contenu peut tenir sur une page. 
    // Avec la refonte et l'utilisation de 'marginTop: "auto"', ça devrait être le cas.

    return (
        <Document>
            <Page size="A4" style={styles.page} wrap={false}>
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', opacity: 0.015 }}>
                    <Watermark />
                </View>

                {/* Header */}
                <View style={styles.header} fixed>
                    <View style={styles.logoContainer}>
                        {/* Placeholder pour un logo moderne ou un texte simple */}
                        <Text style={styles.logoPlaceholder}>{data.companyName || 'ÉVASION'}</Text>
                        <Text style={styles.companyInfo}>{data.companyAddress}</Text>
                        <Text style={styles.companyInfo}>{data.companyEmail}</Text>
                        <Text style={styles.companyInfo}>{data.companyPhone}</Text>
                    </View>
                    <View style={styles.invoiceTitleContainer}>
                        <Text style={styles.invoiceTitle}>{labels.title}</Text>
                        <View style={styles.invoiceMeta}>
                            <Text style={styles.metaLabel}>{labels.reference}:</Text>
                            <Text style={styles.metaValue}>{data.reference}</Text>
                        </View>
                        <View style={styles.invoiceMeta}>
                            <Text style={styles.metaLabel}>{labels.date}:</Text>
                            <Text style={styles.metaValue}>{data.date}</Text>
                        </View>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>{data.status}</Text>
                        </View>
                    </View>
                </View>

                {/* Contenu principal */}
                <View style={styles.content}>
                    {/* Client & Issuer Info */}
                    <View style={styles.infoSection}>
                        <View style={styles.infoBlock}>
                            <Text style={styles.infoLabel}>{labels.clientInfo}</Text>
                            <Text style={styles.infoText}>{data.clientName}</Text>
                            {data.customerEmail && <Text style={styles.infoText}>{data.customerEmail}</Text>}
                            {data.customerAddress && <Text style={styles.infoText}>{data.customerAddress}</Text>}
                        </View>
                        <View style={styles.infoBlock}>
                            <Text style={styles.infoLabel}>{labels.companyInfo}</Text>
                            <Text style={styles.infoText}>{data.companyName || 'Évasion'}</Text>
                            <Text style={styles.infoText}>{data.companyAddress}</Text>
                        </View>
                    </View>

                    {/* Service Details Table */}
                    <Text style={[styles.infoLabel, { marginBottom: 10, borderBottomWidth: 0, color: '#1F2937' }]}>{labels.serviceDetails}</Text>
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeaderCell, styles.col1]}>{labels.description}</Text>
                            <Text style={[styles.tableHeaderCell, styles.col2]}>{labels.checkIn}</Text>
                            <Text style={[styles.tableHeaderCell, styles.col3]}>{labels.checkOut}</Text>
                            <Text style={[styles.tableHeaderCell, styles.col4]}>{labels.guests}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.col1}>
                                <Text style={styles.tableCell}>{data.serviceType || 'N/A'}</Text>
                                <Text style={{ fontSize: 9, color: '#6B7280', marginTop: 2 }}>{data.description}</Text>
                            </View>
                            <Text style={[styles.tableCell, styles.col2]}>{data.checkInDate || 'N/A'}</Text>
                            <Text style={[styles.tableCell, styles.col3]}>{data.checkOutDate || 'N/A'}</Text>
                            <Text style={[styles.tableCell, styles.col4]}>{data.guests || 'N/A'}</Text>
                        </View>
                    </View>

                    {/* Payment Details & Total */}
                    <View style={styles.totalContainer}>
                        <View style={styles.totalBox}>
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>{labels.method}:</Text>
                                <Text style={styles.totalValue}>{data.paymentMethod}</Text>
                            </View>
                            <View style={styles.grandTotalRow}>
                                <Text style={styles.grandTotalLabel}>{labels.total}</Text>
                                <Text style={styles.grandTotalValue}>{data.amount} {data.currency}</Text>
                            </View>
                        </View>
                    </View>

                    {/* QR et Signature (en bas de page) */}
                    <View style={styles.bottomSection}>
                        {/* QR Code */}
                        <View>
                            {labels.qrCodeUrl && (
                                <>
                                    
                                    <Image src={labels.qrCodeUrl} style={styles.qrCode} />
                                </>
                            )}
                        </View>

                        {/* Signature Section */}
                        <View style={styles.signatureContainer}>
                            <Text style={styles.signatureLabel}>{labels.manager}</Text>
                            <View style={{ height: 60, width: 200, justifyContent: 'center', alignItems: 'center' }}>
                                {/* Logo Signature SVG */}
                              <Svg viewBox="0 0 577.19 337.8" width={200} height={120}>
                                  <Path fill="#1d76bc" d="M581.27,243.21Q526.37,319,471.86,395.06q-9.28,6.87-19,13.12c-4,2.59-8.22,5.8-12.9,7.09-3.17.87-6.52,1-9.14-1.21a7.24,7.24,0,0,1-2.74-5.46,32.11,32.11,0,0,0,1.45-3.38c.59-1.69-1.9-3.17-3.06-1.78-.1.12-.18.25-.28.37h0l0,.06a8.57,8.57,0,0,0-1.1,1.91,32.32,32.32,0,0,1-2.92,3.91,75.81,75.81,0,0,0,5.81-11.26c1.08-2.59-2.7-4.31-4.45-2.59A36.63,36.63,0,0,0,413.8,412a68.53,68.53,0,0,1-18.14,16c2.34-7.75,4.67-15.49,7.11-23.2.89-2.82-3.43-4.7-4.81-2a68.88,68.88,0,0,1-14.43,19.1,61,61,0,0,1,2.68-11.05,88.43,88.43,0,0,0,4.94-10.92c1-2.68-3.19-4.34-4.56-1.93a74.15,74.15,0,0,0-5.09,10.94A83.21,83.21,0,0,1,354,437.77a71.55,71.55,0,0,1,12.26-36.38c1.3-1.94-1.79-3.7-3.11-1.82a80.74,80.74,0,0,0-14.36,42.86,2.57,2.57,0,0,0,3.83,2.2,78.32,78.32,0,0,0,25.19-21.14c-.21,1.57-.37,3.16-.48,4.75-.17,2.66,3,3.27,4.7,1.95a72.94,72.94,0,0,0,10.16-9.62l-4,12.38c-.81,2.55,2.07,4.15,4.15,3.19a68.88,68.88,0,0,0,21.18-15.35,2.92,2.92,0,0,0,2.72.1,27.56,27.56,0,0,0,8.94-7.66,12,12,0,0,0,3.78,4.7c6.67,5,15.35,1.08,21.63-2.57,4.08-2.37,8.09-4.89,12-7.52l-34.53,48.07q-12.9,2.86-25.79,5.8a131.71,131.71,0,0,0-23.48,3.63,92.3,92.3,0,0,0-15,5.19q-24.53,5.7-49,11.5-28.41,6.72-56.8,13.57c14.4-10.82,29-21.36,42.58-33.19C314.77,450.09,327.51,436.22,337,420a2.57,2.57,0,0,0-2.21-3.84h-1A104.93,104.93,0,0,0,345,403.09c12-16.86,17.17-39.89,8.32-59.35-9.36-20.59-31.92-26.59-52.81-25.54-11.77.59-23.37,3-34.88,5.36q-20.55,4.31-40.87,9.7A791,791,0,0,0,61.84,396.53C41.25,407.29,14.65,420.45,10.48,446c-.28,1.75,1.11,3.77,3.11,3.11,50.15-16.68,100.69-32.51,150.2-51,1-.38.63-2-.47-1.68-49.39,14-98.08,30.62-146.91,46.47,5.82-19.46,26.23-30.36,43.15-39.36a782.65,782.65,0,0,1,218.09-77.29c20.33-3.92,46.38-7.3,62.84,8.4,15.91,15.19,14,41.08,3.83,58.84a93.94,93.94,0,0,1-19.12,22.86c-40.64.93-80.84,7-119.69,19.32-38.67,12.25-78.32,29.62-110,55.38-16.17,13.15-30.21,29.71-37.64,49.38-.77,2,1.2,4.29,3.23,4.24,3.64-.08,7.27-.34,10.88-.73-5.55,2-11.06,4-16.51,6.3-16,6.63-32,14.35-45.59,25.34-2.28,1.85.64,5.39,3.06,4,13.81-8,27.56-15.87,42.32-22.06a408.59,408.59,0,0,1,45.45-15.58c32.8-9.43,66.1-17.27,99.21-25.51,10-2.5,20-5,30.05-7.42a229.76,229.76,0,0,0-22.69,21.21,150.37,150.37,0,0,0-16.83,21.79c-2.34,3.74-4.73,8-3.53,12.6,1.07,4.05,4.56,6.62,8.23,8.18,21,9,46.88,3.19,64-11,2.15-1.79-.68-5.48-3-3.89-16,10.92-37.81,15.44-56.41,8.86-2.18-.77-5.4-1.92-5.74-4.63-.29-2.26,2.07-5.24,3.18-7q3.42-5.46,7.37-10.56a173.24,173.24,0,0,1,17.11-18.82A314.94,314.94,0,0,1,245.75,505q51.13-12.55,102.33-24.8A56.21,56.21,0,0,0,338,491c-12.14,17-12.31,38.78-11.45,58.81.33,7.8.52,17.57,7.79,22.41,7.54,5,16.16,1.07,22.26-4.26,8.28-7.25,14.09-17.78,20.41-26.68q11-15.48,22-31l30.9-43.67c25.7,1.19,51.41,3.28,75.07-8.19,2.38-1.15.7-5.27-1.82-4.32-22.53,8.58-46,7.77-69.54,7.27.42-.59.83-1.18,1.25-1.76q47.88-11.37,95.69-23c1.49-.36.85-2.57-.62-2.28q-45.46,9.12-90.74,19.18l41.5-58.64Q487.47,389.53,494,384c27.45-23.31,51.31-51.28,68.89-82.77a265.13,265.13,0,0,0,23.22-56C587,242.2,583,240.89,581.27,243.21ZM143.15,467.1a410.69,410.69,0,0,1,119.32-40.05,394.22,394.22,0,0,1,56.77-5.71c-8.85,7.11-18.49,13.38-27.79,19.45Q259.69,461.48,226,479a770.3,770.3,0,0,1-78.11,35.31c-26,10-53.63,21.49-81.78,23.36C80.57,504.59,112,483.29,143.15,467.1Zm65.65,40.45c-22.56,5.51-45.18,10.88-67.71,16.57l1.89-.72a764.52,764.52,0,0,0,73.43-32.29,772,772,0,0,0,72-41.16c13.6-8.76,27.8-17.76,40-28.73.58,0,1.15,0,1.72,0-20.49,30.86-52.43,51.26-81.61,73.14q-3.44,2.58-6.85,5.2Q225.27,503.55,208.8,507.55Zm207.73-35.46Q396.1,500.5,375.71,529c-6.81,9.5-13.14,19.79-20.73,28.67-5.08,6-16,14.18-19.94,2.62-1.5-4.38-1.61-9.31-2-13.88-.47-5.12-.84-10.24-.84-15.38,0-10.21,1.14-20.67,5.37-30.07,4.69-10.41,12.71-18.06,22.23-23.48q23.69-5.67,47.4-11.27c4.5-.11,9-.06,13.56.08Zm75.16-92.85Q533.92,319.59,576,259.83C559.71,306.35,529,347.1,491.69,379.24Z" transform="translate(-9.05 -242.02)" />
                              </Svg>
                            </View>
                            <View style={styles.signatureLine} />
                            <Text style={styles.signatureName}>{data.managerName || 'EVASION'}</Text>
                            <Text style={{ fontSize: 9, color: ACCENT }}>LEISURE • HOSPITALITY • TRAVEL</Text>
                        </View>
                    </View>
                </View>

                {/* Footer (bas de page) */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>{labels.footer}</Text>
                </View>
            </Page>
        </Document>
    );
};

export default PaymentReceiptPdf;
