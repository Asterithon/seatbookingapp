import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { colors } from './styles/global';
import { globalStyles } from './styles/global';
import DateSelector from './comp/DateSelector';
import BookingCard from './comp/BookCard';

interface BookingItem {
    id: string;
    date: string;
    shippingType: string;
    seats: string[];
    totalPrice: number;
    createdAt: string;
}

export default function BookList() {
    const [bookings, setBookings] = useState<BookingItem[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<BookingItem[]>([]);
    
    const [selectedShippingFilter, setSelectedShippingFilter] = useState<string>('all');
    const [dateFilterMode, setDateFilterMode] = useState<'all' | 'custom'>('all');
    const [selectedDateFilter, setSelectedDateFilter] = useState<string>('');
    
    const [totalRevenue, setTotalRevenue] = useState<number>(0);
    const router = useRouter();

    const loadAllBookings = async () => {
        try {
            const allKeys = await AsyncStorage.getAllKeys();
            const bookingKeys = allKeys.filter((key) => key.startsWith('@booking_'));

            if (bookingKeys.length === 0) {
                setBookings([]);
                setFilteredBookings([]);
                setTotalRevenue(0);
                return;
            }

            const stores = await AsyncStorage.multiGet(bookingKeys);
            
            let allBookingsList: BookingItem[] = [];
            stores.forEach(([_, value]) => {
                if (value) {
                    const parsed = JSON.parse(value);
                    if (Array.isArray(parsed)) {
                        allBookingsList = [...allBookingsList, ...parsed];
                    }
                }
            });

            allBookingsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setBookings(allBookingsList);
            setFilteredBookings(allBookingsList);
        } catch (error) {
            console.error("Gagal memuat daftar booking:", error);
        }
    };

    useEffect(() => {
        loadAllBookings();
    }, []);

    useEffect(() => {
        let result = [...bookings];

        if (selectedShippingFilter !== 'all') {
            result = result.filter((item) => item.shippingType === selectedShippingFilter);
        }

        if (dateFilterMode === 'custom' && selectedDateFilter) {
            result = result.filter((item) => item.date === selectedDateFilter);
        }

        setFilteredBookings(result);

        const sumRevenue = result.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
        setTotalRevenue(sumRevenue);

    }, [selectedShippingFilter, dateFilterMode, selectedDateFilter, bookings]);


    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 265, paddingVertical: 20, ...globalStyles.container }} showsVerticalScrollIndicator={false}>
                <Text style={{marginVertical: 20, ...globalStyles.title}}>Booking List History</Text>

                {/* --- filter --- */}
                <View style={globalStyles.blockVertical}>
                    <Text style={globalStyles.label}>Filter by date:</Text>
                    <View style={styles.shippingFilterRow}>
                        {[
                            { label: 'ALL DATES', value: 'all' },
                            { label: 'CUSTOM DATE', value: 'custom' }
                        ].map((item) => (
                            <TouchableOpacity
                                key={item.value}
                                style={[
                                    styles.filterChip,
                                    dateFilterMode === item.value && styles.filterChipActive
                                ]}
                                onPress={() => {
                                    setDateFilterMode(item.value as 'all' | 'custom');
                                    if (item.value === 'all') setSelectedDateFilter('');
                                }}
                            >
                                <Text style={[
                                    styles.filterChipText,
                                    dateFilterMode === item.value && styles.filterChipTextActive
                                ]}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {dateFilterMode === 'custom' && (
                        <DateSelector onDateChange={(date) => setSelectedDateFilter(date)} />
                    )}

                    <Text style={[globalStyles.label, { marginTop: 15 }]}>Filter by service:</Text>
                    <View style={styles.shippingFilterRow}>
                        {['all', 'regular', 'express'].map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.filterChip,
                                    selectedShippingFilter === type && styles.filterChipActive
                                ]}
                                onPress={() => setSelectedShippingFilter(type)}
                            >
                                <Text style={[
                                    styles.filterChipText,
                                    selectedShippingFilter === type && styles.filterChipTextActive
                                ]}>
                                    {type.toUpperCase()}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* --- booking list --- */}
                {(!filteredBookings || filteredBookings.length === 0) ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Tidak ada data pemesanan yang sesuai dengan filter.</Text>
                    </View>
                ) : (
                    filteredBookings.map((item) => (
                        <BookingCard key={item.id} item={item} />
                    ))
                )}
            </ScrollView>

            <View style={globalStyles.blockFixedBottom}>
                <View style={styles.revenueBox}>
                    <Text style={styles.revenueLabel}>Total Revenue:</Text>
                    <Text style={styles.revenueValue}>Rp {totalRevenue.toLocaleString('id-ID')}</Text>
                </View>

                <TouchableOpacity style={{...globalStyles.ButtonLarge, ...globalStyles.darkButton}} onPress={() => router.back()} activeOpacity={0.8}>
                    <Text style={globalStyles.primaryText}>Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    filterContainer: {
        backgroundColor: colors.background,
        padding: 12,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
        width: '100%',
    },
    shippingFilterRow: {
        flexDirection: 'row',
        gap: 8,
    },
    filterChip: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.gray,
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    filterChipActive: {
        backgroundColor: colors.primary,
    },
    filterChipText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: colors.text,
    },
    filterChipTextActive: {
        color: colors.white,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    revenueBox: {
        backgroundColor: colors.tertiary,
        padding: 15,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.secondary,
    },
    revenueLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.primary,
    },
    revenueValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
    },
});