import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/global';

interface BookingItem {
    id: string;
    date: string;
    shippingType?: string;
    seats: string[];
    totalPrice: number;
    createdAt: string;
}

interface BookingCardProps {
    item: BookingItem;
}

export default function BookingCard({ item }: BookingCardProps) {
    const safeShippingType = (item.shippingType || 'regular').toUpperCase();

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.dateText}>{item.date}</Text>
                <View style={[styles.badge, safeShippingType === 'EXPRESS' ? styles.expressBadge : styles.regularBadge]}>
                    <Text style={styles.badgeText}>{safeShippingType}</Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <Text style={styles.label}>Kursi Dipilih:</Text>
                <Text style={styles.seatValue}>{item.seats?.join(', ') || '-'}</Text>
            </View>

            <View style={styles.cardFooter}>
                <Text style={styles.priceLabel}>Total Harga:</Text>
                <Text style={styles.priceValue}>Rp {(item.totalPrice || 0).toLocaleString('id-ID')}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 15,
        marginBottom: 5,
        width: '90%',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
        paddingBottom: 8,
    },
    dateText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    regularBadge: {
        backgroundColor: colors.gray,
    },
    expressBadge: {
        backgroundColor: colors.tertiary,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.dark,
    },
    cardBody: {
        marginBottom: 8,
    },
    label: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    seatValue: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.dark,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: colors.lightGray,
    },
    priceLabel: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    priceValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.primary,
    },
});