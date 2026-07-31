import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { globalStyles } from './styles/global';
import DateSelector from './comp/DateSelector'; // Komponen DateSelector Anda

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
    
    // State untuk Filter & Total Revenue
    const [selectedShippingFilter, setSelectedShippingFilter] = useState<string>('all');
    
    // State baru untuk tipe filter tanggal ('all' atau 'custom')
    const [dateFilterMode, setDateFilterMode] = useState<'all' | 'custom'>('all');
    const [selectedDateFilter, setSelectedDateFilter] = useState<string>('');
    
    const [totalRevenue, setTotalRevenue] = useState<number>(0);
    const router = useRouter();

    // Fungsi untuk mengambil seluruh data booking dari AsyncStorage
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

        // Urutkan berdasarkan yang terbaru
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

    // Logika Filter & Hitung Total Revenue
    useEffect(() => {
        let result = [...bookings];

        // Filter berdasarkan Tipe Layanan
        if (selectedShippingFilter !== 'all') {
        result = result.filter((item) => item.shippingType === selectedShippingFilter);
        }

        // Filter berdasarkan Tanggal (Hanya aktif jika mode 'custom' dan tanggal sudah dipilih)
        if (dateFilterMode === 'custom' && selectedDateFilter) {
        result = result.filter((item) => item.date === selectedDateFilter);
        }

        setFilteredBookings(result);

        // Hitung Total Revenue dari data yang terfilter
        const sumRevenue = result.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
        setTotalRevenue(sumRevenue);

    }, [selectedShippingFilter, dateFilterMode, selectedDateFilter, bookings]);

    // Fungsi Hapus Semua Riwayat
    const handleClearAll = async () => {
        Alert.alert(
        "Konfirmasi",
        "Apakah Anda yakin ingin menghapus semua riwayat booking?",
        [
            { text: "Batal", style: "cancel" },
            { 
            text: "Hapus Semua", 
            style: "destructive", 
            onPress: async () => {
                const allKeys = await AsyncStorage.getAllKeys();
                const bookingKeys = allKeys.filter((key) => key.startsWith('@booking_'));
                await AsyncStorage.multiRemove(bookingKeys);
                setBookings([]);
                setFilteredBookings([]);
                setTotalRevenue(0);
                Alert.alert("Sukses", "Semua riwayat berhasil dihapus.");
            } 
            }
        ]
        );
    };

    return (
        <View>
            <ScrollView contentContainerStyle={{ paddingBottom: 265, padding: 20, ...globalStyles.container }} showsVerticalScrollIndicator={false}>
            <Text style={globalStyles.title}>Daftar Riwayat Booking</Text>

            {/* --- BAGIAN FILTER (TANGGAL & LAYANAN) --- */}
            <View style={styles.filterContainer}>
                
                {/* 1. Filter Mode Tanggal (All / Custom Date) */}
                <Text style={styles.filterLabel}>Filter by date:</Text>
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
                        if (item.value === 'all') setSelectedDateFilter(''); // Reset tanggal jika pilih All
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

                {/* Komponen DateSelector hanya muncul jika mode 'custom' dipilih */}
                {dateFilterMode === 'custom' && (
                <View style={{ marginTop: 10 }}>
                    <DateSelector onDateChange={(date) => setSelectedDateFilter(date)} />
                </View>
                )}

                {/* 2. Filter Berdasarkan Layanan */}
                <Text style={[styles.filterLabel, { marginTop: 15 }]}>Filter by service:</Text>
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

            {/* --- DAFTAR ITEM BOOKING --- */}
            {filteredBookings.length === 0 ? (
                <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Tidak ada data pemesanan yang sesuai dengan filter.</Text>
                </View>
            ) : (
                filteredBookings.map((item) => (
                <View key={item.id} style={globalStyles.card}>
                    <View style={globalStyles.cardHeader}>
                    <Text style={styles.dateText}>{item.date}</Text>
                    <View style={[styles.badge, item.shippingType === 'express' ? styles.expressBadge : styles.regularBadge]}>
                        <Text style={styles.badgeText}>{item.shippingType.toUpperCase()}</Text>
                    </View>
                    </View>

                    <View style={styles.cardBody}>
                    <Text style={styles.label}>Kursi Dipilih:</Text>
                    <Text style={styles.seatValue}>{item.seats.join(', ')}</Text>
                    </View>

                    <View style={styles.cardFooter}>
                    <Text style={styles.priceLabel}>Total Harga:</Text>
                    <Text style={styles.priceValue}>Rp {item.totalPrice.toLocaleString('id-ID')}</Text>
                    </View>
                </View>
                ))
            )}

            </ScrollView>
            <View style={globalStyles.blockFixedBottom}>
                <View style={styles.revenueBox}>
                <Text style={styles.revenueLabel}>Total Revenue:</Text>
                <Text style={styles.revenueValue}>Rp {totalRevenue.toLocaleString('id-ID')}</Text>
                </View>

                <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
                <Text style={styles.backButtonText}>Kembali ke Beranda</Text>
                </TouchableOpacity>

                {bookings.length > 0 && (
                <TouchableOpacity style={styles.clearButton} onPress={handleClearAll} activeOpacity={0.8}>
                    <Text style={styles.clearButtonText}>Hapus Semua Riwayat</Text>
                </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  filterContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
    width: '100%',
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 6,
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
    borderColor: '#ced4da',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  filterChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#0056b3',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#495057',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
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
    backgroundColor: '#e2e3e5',
  },
  expressBadge: {
    backgroundColor: '#cce5ff',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#383d41',
  },
  cardBody: {
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 2,
  },
  seatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  priceLabel: {
    fontSize: 12,
    color: '#6c757d',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28a745',
  },
  bottomSection: {
    width: '100%',
    marginTop: 10,
    marginBottom: 30,
  },
  revenueBox: {
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  revenueLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  revenueValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
    width: '100%',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});