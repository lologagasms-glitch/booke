import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font, Svg, Path } from '@react-pdf/renderer';

// Register fonts
Font.register({
    family: 'Helvetica-Bold',
    src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfA.ttf'
});

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 40,
        fontFamily: 'Helvetica',
        color: '#374151', // Gray-700
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
        borderBottomWidth: 2,
        borderBottomColor: '#F59E0B', // Amber-500
        paddingBottom: 20,
    },
    logoContainer: {
        flexDirection: 'column',
    },
    logoText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#F59E0B',
        marginBottom: 4,
    },
    companyInfo: {
        fontSize: 10,
        color: '#6B7280',
        lineHeight: 1.4,
    },
    invoiceTitleContainer: {
        alignItems: 'flex-end',
    },
    invoiceTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    invoiceMeta: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    metaLabel: {
        fontSize: 10,
        color: '#6B7280',
        width: 80,
        textAlign: 'right',
        marginRight: 10,
    },
    metaValue: {
        fontSize: 10,
        color: '#111827',
        fontWeight: 'bold',
        textAlign: 'right',
    },
    statusBadge: {
        marginTop: 10,
        paddingVertical: 6,
        paddingHorizontal: 16,
        backgroundColor: '#10B981', // Emerald-500
        borderRadius: 20,
        alignSelf: 'flex-end',
    },
    statusText: {
        color: '#FFFFFF', // White
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    content: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 10,
        textTransform: 'uppercase',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 4,
        marginTop: 20,
    },
    clientInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    infoBlock: {
        width: '45%',
    },
    infoLabel: {
        fontSize: 10,
        color: '#9CA3AF',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    infoText: {
        fontSize: 11,
        color: '#111827',
        marginBottom: 2,
    },
    table: {
        marginTop: 10,
        marginBottom: 30,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#F9FAFB',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    tableHeaderCell: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#6B7280',
        textTransform: 'uppercase',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    tableCell: {
        fontSize: 11,
        color: '#111827',
    },
    col1: { width: '40%' },
    col2: { width: '20%', textAlign: 'center' },
    col3: { width: '20%', textAlign: 'center' },
    col4: { width: '20%', textAlign: 'right' },

    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
    totalBox: {
        width: '40%',
        backgroundColor: '#F9FAFB',
        padding: 20,
        borderRadius: 12,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    totalLabel: {
        fontSize: 11,
        color: '#6B7280',
    },
    totalValue: {
        fontSize: 11,
        color: '#111827',
        fontWeight: 'bold',
    },
    grandTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    grandTotalLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111827',
    },
    grandTotalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#F59E0B',
    },
    footer: {
        marginTop: 'auto',
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 9,
        color: '#9CA3AF',
        width: '70%',
        lineHeight: 1.4,
    },
    qrCode: {
        width: 60,
        height: 60,
    },
    signatureContainer: {
        marginTop: 40,
        marginBottom: 20,
        alignSelf: 'flex-end',
        width: 200,
        alignItems: 'center',
    },
    signatureLine: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#111827',
        marginBottom: 8,
    },
    signatureLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    signatureName: {
        fontSize: 12,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        color: '#111827',
        fontStyle: 'italic',
        marginTop: 4,
    },
    // New wrapper for left-aligned QR + payment + signature
    qrPaymentSignatureWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 20,
    },
    qrColumn: {
        width: '30%',
        paddingRight: 20,
    },
    paymentSignatureColumn: {
        width: '70%',
        flexDirection: 'column',
        alignItems: 'flex-end',
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
        clientInfo?: string;
        companyInfo?: string;
        date: string;
        method: string;
        status: string;
        description: string;
        reference: string;
        serviceDetails?: string;
        checkIn?: string;
        checkOut?: string;
        guests?: string;
        manager?: string;
        total: string;
        footer: string;
        qrCodeUrl?: string;
    };
}

// Helper to generate a procedural signature path
const generateSignaturePath = (name: string) => {
    // Simple seeded random number generator
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

    // Initial flourish
    path += `C ${x + 5} ${y - 10 - random() * 20}, ${x + 10} ${y + 10 + random() * 10}, ${x + 20} ${y - 5} `;
    x += 20;

    // Generate loops for each character
    for (let i = 0; i < name.length; i++) {
        const char = name[i];
        const width = 10 + random() * 10;
        const height = 15 + random() * 15;
        const yOffset = (random() - 0.5) * 10;

        if (char === ' ') {
            x += 15;
            continue;
        }

        // Up stroke
        const cp1x = x + width * 0.2;
        const cp1y = y - height;
        const cp2x = x + width * 0.8;
        const cp2y = y - height;

        // Down stroke
        const endX = x + width;
        const endY = y + yOffset;

        path += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY} `;
        x = endX;
    }

    // Final flourish
    path += `C ${x + 20} ${y - 10}, ${x + 40} ${y + 5}, ${x + 60} ${y - 5}`;

    return path;
};

const PaymentReceiptPdf: React.FC<PaymentReceiptProps> = ({ data, labels }) => {
    const signaturePath = data.managerName ? generateSignaturePath(data.managerName) : "";

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>{data.companyName || 'Évasion'}</Text>
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

                <View style={styles.content}>
                    {/* Client & Issuer Info */}
                    <View style={styles.clientInfoContainer}>
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
                    <Text style={styles.sectionTitle}>{labels.serviceDetails}</Text>
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeaderCell, styles.col1]}>{labels.description}</Text>
                            <Text style={[styles.tableHeaderCell, styles.col2]}>{labels.checkIn}</Text>
                            <Text style={[styles.tableHeaderCell, styles.col3]}>{labels.checkOut}</Text>
                            <Text style={[styles.tableHeaderCell, styles.col4]}>{labels.guests}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.col1}>
                                <Text style={styles.tableCell}>{data.serviceType}</Text>
                                <Text style={{ fontSize: 9, color: '#6B7280', marginTop: 2 }}>{data.description}</Text>
                            </View>
                            <Text style={[styles.tableCell, styles.col2]}>{data.checkInDate}</Text>
                            <Text style={[styles.tableCell, styles.col3]}>{data.checkOutDate}</Text>
                            <Text style={[styles.tableCell, styles.col4]}>{data.guests}</Text>
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

                    {/* QR + Payment + Signature Section */}
                    <View style={styles.qrPaymentSignatureWrapper}>
                        {/* QR Code on the left */}
                        <View style={styles.qrColumn}>
                            {labels.qrCodeUrl && (
                                <Image src={labels.qrCodeUrl} style={styles.qrCode} />
                            )}
                        </View>

                        {/* Payment details & signature on the right */}
                        <View style={styles.paymentSignatureColumn}>
                            {/* Signature Section */}
                            {data.managerName && (
                                <View style={styles.signatureContainer}>
                                    <Text style={styles.signatureLabel}>{labels.manager}</Text>
                                    <View style={{ height: 60, width: 200, justifyContent: 'center', alignItems: 'center' }}>
                                        <Svg viewBox="0 0 174.74 103.65" style={{ width: 200, height: 60 }}>
                                            <Path
                                                d="M75.26,303.41c3.2-5.88,8.23-10.4,13.5-14.42,5.56-4.23,11.34-8.14,16.59-12.77,11.24-9.91,20.5-21.81,29.25-33.9,5.15-7.11,10.49-14.2,14.94-21.78.71-1.21-.8-3-2-2a24.32,24.32,0,0,0-6.66,8.42c-1.86,3.54-3.5,7.2-5,10.9a184.63,184.63,0,0,0-7.73,23.73c-2.09,8.08-3.89,16.27-5.33,24.5a114.62,114.62,0,0,0-1.62,12.79,44.42,44.42,0,0,0,.44,12c1.37,6.48,7.27,13,14.46,10.55,6.51-2.2,10.22-9.86,10.9-16.27.8-7.65-4.46-13.27-10.6-16.95a57.46,57.46,0,0,0-21.6-7.33c-16.43-2.29-32.79,1.27-48.6,5.53q-3.14.84-6.25,1.71l1.16,2.74q13.85-6.11,28.12-11.24a247,247,0,0,1,29.12-8.91c10-2.25,20.14-2.95,30.36-3.26,10.42-.3,20.82-.62,31.22-1.46,11.71-1,23.38-2.29,35-3.63,1.9-.22,1.92-3.22,0-3-10.52,1.21-21,2.42-31.59,3.34s-21,1.39-31.51,1.67c-10.33.27-20.65.71-30.8,2.7a213.26,213.26,0,0,0-29.49,8.54q-16.25,5.69-32,12.66c-1.58.69-.44,3.18,1.16,2.74,14.91-4.11,30.13-8.32,45.74-7.84A64.18,64.18,0,0,1,127,286.93c5.79,2.16,12.67,5.55,15.75,11.22s.34,14-4.18,18.23c-2.11,2-5,3.1-7.84,2.05a10.18,10.18,0,0,1-5.72-6.54c-1.15-3.56-1.09-7.44-.94-11.14a99.22,99.22,0,0,1,1.22-11.54c1.22-7.59,2.87-15.13,4.67-22.6a203,203,0,0,1,7.35-24.35c1.54-4.06,3.25-8,5.18-11.93,1.67-3.37,3.49-6.93,6.55-9.25L147,219c-4,6.77-8.7,13.1-13.27,19.47-4.39,6.11-8.86,12.17-13.65,18a156.73,156.73,0,0,1-15.34,16.32c-5.24,4.77-11,8.77-16.66,13-6,4.48-11.74,9.44-15.36,16.09-.93,1.69,1.66,3.21,2.59,1.51Z"
                                                fill="#0066cc"
                                                transform="translate(-58.77 -218.22)"
                                            />
                                            <Path
                                                d="M150.41,263.77a21.23,21.23,0,0,1,7.54.33c2,.45,4,1.21,5.63-.35,1.19-1.11,1.46-2.74,2.19-4.14.91-1.74,2.77-1.53,4.27-.6,2,1.23,3.37,3.19,5.49,4.22a6.12,6.12,0,0,0,5.94,0c1.88-1.12,3.12-2.68,5.46-2.83a6.56,6.56,0,0,1,2.81.43c1,.42,1.84,1.24,2.93,1.52,2.55.66,4.27-1.52,5.57-3.36a54.54,54.54,0,0,0,4.34-7.33,1.52,1.52,0,0,0-.9-2.2,5.9,5.9,0,0,0-5.87,2c-1.65,1.92-2.14,4.49-2.64,6.9-1.16,5.54-2.12,11.12-2.81,16.73a116.14,116.14,0,0,0,.4,33.92,36.85,36.85,0,0,0,1.83,7.78c.89,2.13,3.21,3.05,5.13,1.51s2.73-4.32,3.27-6.54a20.59,20.59,0,0,0,.42-7.7c-1.33-10.05-9.65-17.15-18.48-21a80.63,80.63,0,0,0-17.28-5.2,52.77,52.77,0,0,0-19-.38l.8,2.9c22.13-5.85,45.2-4.88,67.78-7.53,3.09-.36,6.17-.79,9.24-1.31,1.62-.27,3.24-.57,4.85-.9,1.33-.27,2.75-.42,3.73-1.44,1.33-1.4-.78-3.52-2.12-2.12-.35.36-1,.38-1.48.48l-2.08.42c-1.38.27-2.77.52-4.16.75q-4.09.68-8.22,1.15c-5.53.64-11.09,1.07-16.66,1.44-11.11.73-22.26,1.21-33.32,2.66a146.41,146.41,0,0,0-18.36,3.5c-1.9.51-1.08,3.23.8,2.9,9.6-1.69,19.44.31,28.58,3.29,8.06,2.63,16.25,6.79,20.38,14.58a18,18,0,0,1,1.7,12.48c-.16.72-1.51,5.68-2.56,5.31-.51-.17-.75-2.2-.84-2.58-.29-1.22-.56-2.44-.8-3.67a106.12,106.12,0,0,1-1.17-29.08c.47-5.53,1.26-11,2.27-16.48.48-2.56.91-5.15,1.58-7.66.49-1.87,1.77-4.89,4.25-4.26l-.89-2.2a55.65,55.65,0,0,1-3.58,6.22,16.89,16.89,0,0,1-1.79,2.43c-1,1.06-1.61.39-2.68-.22a9.29,9.29,0,0,0-5.77-1.1,10.92,10.92,0,0,0-5.45,2.63,3.32,3.32,0,0,1-2.36.91,6.05,6.05,0,0,1-3.05-1.52c-1.63-1.35-3.08-3-5.11-3.76a5.79,5.79,0,0,0-5.42.44c-1.37,1-1.88,2.54-2.5,4-.19.46-.42,1.23-.9,1.47s-1.26-.13-1.75-.26c-.66-.18-1.32-.33-2-.45a26,26,0,0,0-8-.11,1.51,1.51,0,0,0-1.05,1.85,1.55,1.55,0,0,0,1.84,1Z"
                                                fill="#0066cc"
                                                transform="translate(-58.77 -218.22)"
                                            />
                                        </Svg>
                                    </View>
                                    <View style={styles.signatureLine} />
                                    <Text style={styles.signatureName}>{data.managerName}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                {/* Footer (text only, QR moved above) */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>{labels.footer}</Text>
                </View>
            </Page>
        </Document>
    );
};

export default PaymentReceiptPdf;
