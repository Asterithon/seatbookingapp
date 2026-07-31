import { useState, useEffect } from "react";
import { StyleSheet, Text, ScrollView, View, TouchableOpacity, Alert } from "react-native";
import { useRouter, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalStyles } from "./styles/global";
import ShippingSelector from "./comp/ShippingSelect";
import SeatGrid from "./comp/SeatGrid";
import PriceBox from "./comp/PriceBox";
import DateSelector from "./comp/DateSelector";

export default function Book() {
    // 1. State Utama untuk menyimpan pilihan user
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [shippingType, setShippingType] = useState<string>('regular');
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [bookedSeats, setBookedSeats] = useState<string[]>([]); // State untuk menampung kursi yang sudah dibooking orang lain

    // 2. Fungsi untuk meload kursi yang sudah dibooking dari AsyncStorage berdasarkan Tanggal & Layanan
    const fetchBookedSeats = async (date: string, shipping: string) => {
        if (!date) return;
        try {
            const storageKey = `@booking_${date}_${shipping}`;
            const existingData = await AsyncStorage.getItem(storageKey);
            
            if (existingData) {
                const parsedData = JSON.parse(existingData);
                // Menggabungkan semua array 'seats' dari data transaksi yang tersimpan di tanggal & shipping tersebut
                const allBooked = parsedData.flatMap((item: any) => item.seats);
                setBookedSeats(allBooked);
            } else {
                setBookedSeats([]); // Jika belum ada data, kosongkan
            }
        } catch (error) {
            console.error("Gagal memuat data booking:", error);
        }
    };

    // Jalankan fetch setiap kali tanggal atau jenis shipping berubah
    useEffect(() => {
        if (selectedDate) {
            fetchBookedSeats(selectedDate, shippingType);
        }
    }, [selectedDate, shippingType]);

    // 3. Handler saat Tanggal diubah -> Reset kursi terpilih & load ulang data
    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setSelectedSeats([]); 
    };

    // 4. Handler saat Tipe Layanan diubah -> Reset kursi terpilih & load ulang data
    const handleShippingChange = (type: string) => {
        setShippingType(type);
        setSelectedSeats([]); 
    };

    // Helper untuk menghitung total harga (mengikuti aturan jendela / tengah)
    const calculateTotalPrice = () => {
        let total = 0;
        selectedSeats.forEach((seat) => {
            const seatNumber = seat.slice(-1);
            const isWindowSeat = seatNumber === '1' || seatNumber === '4';

            if (shippingType === 'express') {
                total += isWindowSeat ? 200000 : 150000;
            } else {
                total += isWindowSeat ? 150000 : 100000;
            }
        });
        return total;
    };

    // 5. Fungsi Konfirmasi Booking & Menyimpan ke AsyncStorage
    const handleCheckout = async () => {
        if (selectedSeats.length === 0) {
            Alert.alert("Warn", "Silakan pilih minimal 1 kursi terlebih dahulu!");
            return;
        }

        try {
            const storageKey = `@booking_${selectedDate}_${shippingType}`;
            
            // Ambil data transaksi lama di tanggal & shipping tersebut (jika ada)
            const existingData = await AsyncStorage.getItem(storageKey);
            const bookings = existingData ? JSON.parse(existingData) : [];

            // Buat objek transaksi baru
            const newBooking = {
                id: Date.now().toString(),
                date: selectedDate,
                shippingType: shippingType,
                seats: selectedSeats,
                totalPrice: calculateTotalPrice(),
                createdAt: new Date().toISOString(),
            };

            // Masukkan transaksi baru ke dalam array
            bookings.push(newBooking);

            // Simpan kembali ke AsyncStorage dalam format JSON string
            await AsyncStorage.setItem(storageKey, JSON.stringify(bookings));

            console.log("Data Booking Berhasil Disimpan:", newBooking);
            Alert.alert("Sukses", `Booking untuk tanggal ${selectedDate} (${shippingType}) dengan kursi [${selectedSeats.join(', ')}] berhasil disimpan!`);

            // Reset pilihan kursi lokal & refresh status kursi yang ter-disable
            setSelectedSeats([]);
            fetchBookedSeats(selectedDate, shippingType);

        } catch (error) {
            console.error("Gagal menyimpan booking:", error);
            Alert.alert("Error", "Terjadi kesalahan saat menyimpan data ke penyimpanan lokal.");
        }
    };

    return (
        <ScrollView contentContainerStyle={globalStyles.container} showsVerticalScrollIndicator={false}>
        <Text style={globalStyles.title}>Form Pemesanan Kursi</Text>

        {/* Komponen Pemilih Tanggal */}
        <DateSelector onDateChange={handleDateChange} />

        {/* Komponen Pemilih Jenis Layanan (Regular / Express) */}
        <ShippingSelector selected={shippingType} onSelect={handleShippingChange} />

        {/* Label Penanda Grid Kursi */}
        <Text style={globalStyles.text}>Pilih Kursi (Maks. 5):</Text>

        {/* Komponen Grid Kursi */}
        <SeatGrid 
            bookedSeats={bookedSeats} // Kursi yang sudah ter-booking otomatis menjadi disabled (merah)
            shippingType={shippingType} 
            selectedSeats={selectedSeats} 
            onSeatChange={setSelectedSeats} 
        />

        {/* Komponen Boks Harga Realtime */}
        <PriceBox
            selectedSeats={selectedSeats} 
            shippingType={shippingType} 
        />

        {/* Tombol Konfirmasi Booking */}
        <TouchableOpacity style={styles.bookingBtn} onPress={handleCheckout} activeOpacity={0.8}>
            <Text style={styles.bookingBtnText}>Konfirmasi Pesanan</Text>
        </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    bookingBtn: {
        backgroundColor: '#28a745',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    bookingBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});