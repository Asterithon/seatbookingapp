import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import DateSelector from "./comp/DateSelector";
import PriceBox from "./comp/PriceBox";
import SeatGrid from "./comp/SeatGrid";
import ServiceSelector from "./comp/ServiceSelect";
import { globalStyles } from "./styles/global";

export default function Book() {
    // 1. State Utama untuk menyimpan pilihan user
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [shippingType, setShippingType] = useState<string>("regular");
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
        const isWindowSeat = seatNumber === "1" || seatNumber === "4";

        if (shippingType === "express") {
            total += isWindowSeat ? 200000 : 150000;
        } else {
            total += isWindowSeat ? 150000 : 100000;
        }
        });
        return total;
    };

    // 5. Fungsi Konfirmasi Booking & Menyimpan ke AsyncStorage
    // Helper untuk menghitung total kapasitas kursi
    const getTotalCapacity = (shipping: string) => {
        const rows =
        shipping === "regular" ? ["A", "B", "C", "D", "E"] : ["A", "B", "C"];
        const seatsPerRow = 4; // Kolom [1, 2, 3, 4]
        return rows.length * seatsPerRow;
    };

    // Fungsi Konfirmasi Booking dengan Logika If-Else yang Jelas
    const handleCheckout = async () => {
        if (selectedSeats.length === 0) {
        Alert.alert("Warn", "Silakan pilih minimal 1 kursi terlebih dahulu!");
        return;
        }

        try {
        const storageKey = `@booking_${selectedDate}_${shippingType}`;

        // 1. Ambil data terbaru dari AsyncStorage
        const existingData = await AsyncStorage.getItem(storageKey);
        const bookings = existingData ? JSON.parse(existingData) : [];

        // Gabungkan semua kursi yang sudah dibooking orang lain sebelumnya
        const currentBookedSeats = bookings.flatMap((item: any) => item.seats);

        // 2. Hitung total kapasitas dan sisa kursi
        const maxTotalSeats = getTotalCapacity(shippingType);
        const remainingSeats = maxTotalSeats - currentBookedSeats.length;

        // 3. LOGIKA IF-ELSE UTAMA
        // Jika jumlah kursi yang dipilih pengguna SAMA DENGAN sisa kursi (berarti habis/penuh total)
        if (selectedSeats.length === remainingSeats) {
            Alert.alert(
            "Fully Booked",
            `All seats in ${shippingType} at ${selectedDate} have been booked. The seats for this service and date will reset.`,
            [
                {
                text: "OK",
                onPress: async () => {
                    // Hapus semua riwayat booking di tanggal & layanan tersebut
                    await AsyncStorage.removeItem(storageKey);
                    setBookedSeats([]);
                    setSelectedSeats([]);
                    router.replace("/");
                },
                },
            ],
            );
        } else {
            // JIKA TIDAK PENUH (masih ada sisa kursi lain), data langsung di-store secara normal
            const newBooking = {
            id: Date.now().toString(),
            date: selectedDate,
            shippingType: shippingType,
            seats: selectedSeats,
            totalPrice: calculateTotalPrice(),
            createdAt: new Date().toISOString(),
            };

            bookings.push(newBooking);

            // Simpan ke AsyncStorage
            await AsyncStorage.setItem(storageKey, JSON.stringify(bookings));

            Alert.alert(
            "Sukses",
            `Booking untuk tanggal ${selectedDate} (${shippingType}) dengan kursi [${selectedSeats.join(", ")}] berhasil disimpan!`,
            [
                {
                text: "OK",
                onPress: () => {
                    router.replace("/");
                },
                },
            ],
            );
        }
        } catch (error) {
        console.error("Gagal menyimpan booking:", error);
        Alert.alert(
            "Error",
            "Terjadi kesalahan saat menyimpan data ke penyimpanan lokal.",
        );
        }
    };

    return (
        <View>
            <ScrollView
            contentContainerStyle={globalStyles.container}
            >
                <View style={{marginTop: 20, ...globalStyles.blockVertical}}>
                    <Text style={globalStyles.title}>Book your Seat</Text>

                    {/* Komponen Pemilih Tanggal */}
                    <DateSelector onDateChange={handleDateChange} />
                </View>

                {/* Komponen Pemilih Jenis Layanan (Regular / Express) */}
                <View style={globalStyles.blockVerticalThin}>
                    <ServiceSelector
                        selected={shippingType}
                        onSelect={handleShippingChange}
                        />
                </View>

                {/* Grid Kursi */}
                <View style={{marginBottom:265, ...globalStyles.blockVertical}}>
                    <Text style={globalStyles.text}>Choose seat (Max 5)</Text>
                <SeatGrid
                    bookedSeats={bookedSeats} // Kursi yang sudah ter-booking otomatis menjadi disabled (merah)
                    shippingType={shippingType}
                    selectedSeats={selectedSeats}
                    onSeatChange={setSelectedSeats}
                    />
                </View>

            </ScrollView>
                <View style={globalStyles.blockFixedBottom}>
                    {/* Komponen Boks Harga Realtime */}
                    <PriceBox selectedSeats={selectedSeats} shippingType={shippingType} />
                    {/* Tombol Konfirmasi Booking */}
                    <TouchableOpacity
                        style={{...globalStyles.ButtonLarge, ...globalStyles.primaryButton}}
                        onPress={handleCheckout}
                        activeOpacity={0.8}
                        >
                        <Text style={styles.bookingBtnText}>Konfirmasi Pesanan</Text>
                    </TouchableOpacity>
                </View>
        </View>
    );
}

const styles = StyleSheet.create({
    bookingBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
