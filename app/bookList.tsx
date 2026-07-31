import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { globalStyles } from './styles/global';

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
  const router = useRouter();

  // Fungsi untuk mengambil seluruh data booking dari AsyncStorage
  const loadAllBookings = async () => {
    try {
      // Ambil semua keys yang tersimpan di AsyncStorage
      const allKeys = await AsyncStorage.getAllKeys();
      
      // Saring kunci yang berawalan dengan format booking kita (@booking_)
      const bookingKeys = allKeys.filter((key) => key.startsWith('@booking_'));

      if (bookingKeys.length === 0) {
        setBookings([]);
        return;
      }

      // Ambil data dari semua keys tersebut
      const stores = await AsyncStorage.multiGet(bookingKeys);
      
      let allBookingsList: BookingItem[] = [];
      stores.forEach(([_, value]) => {
        if (value) {
          const parsed = JSON.parse(value);
          // Karena setiap key bisa berisi array of bookings, kita gabungkan
          if (Array.isArray(parsed)) {
            allBookingsList = [...allBookingsList, ...parsed];
          }
        }
      });

      // Urutkan berdasarkan yang terbaru (berdasarkan waktu dibuat)
      allBookingsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setBookings(allBookingsList);
    } catch (error) {
      console.error("Gagal memuat daftar booking:", error);
    }
  };

  // Load data saat halaman pertama kali dibuka
  useEffect(() => {
    loadAllBookings();
  }, []);

  // Fungsi opsional untuk mereset/menghapus semua riwayat booking (membersihkan storage)
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
            Alert.alert("Sukses", "Semua riwayat berhasil dihapus.");
          } 
        }
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={globalStyles.container} showsVerticalScrollIndicator={false}>
      <Text style={globalStyles.title}>Daftar Riwayat Booking</Text>

      {bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Belum ada data pemesanan kursi.</Text>
        </View>
      ) : (
        bookings.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.dateText}>📅 {item.date}</Text>
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

      {/* Tombol Navigasi / Aksi */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
        <Text style={styles.backButtonText}>Kembali ke Beranda</Text>
      </TouchableOpacity>

      {bookings.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClearAll} activeOpacity={0.8}>
          <Text style={styles.clearButtonText}>Hapus Semua Riwayat</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6c757d',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
  backButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
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
    marginBottom: 30,
    width: '100%',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});