import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, View, Text, TouchableOpacity } from "react-native";
import DateSelector from "./comp/DateSelector";
import PriceBox from "./comp/PriceBox";
import SeatGrid from "./comp/SeatGrid";
import ServiceSelector from "./comp/ServiceSelect";
import { globalStyles } from "./styles/global";

export default function Book() {
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [shippingType, setShippingType] = useState<string>("regular");
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [bookedSeats, setBookedSeats] = useState<string[]>([]); 

    // load booked seat from asynxstorage
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
            setBookedSeats([]);
        }
        } catch (error) {
        console.error("Gagal memuat data booking:", error);
        }
    };

    // auto fetcg
    useEffect(() => {
        if (selectedDate) {
        fetchBookedSeats(selectedDate, shippingType);
        }
    }, [selectedDate, shippingType]);

    // date
    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setSelectedSeats([]);
    };

    // shiping/service
    const handleShippingChange = (type: string) => {
        setShippingType(type);
        setSelectedSeats([]);
    };

    // total price
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

    const getTotalCapacity = (shipping: string) => {
        const rows =
        shipping === "regular" ? ["A", "B", "C", "D", "E"] : ["A", "B", "C"];
        const seatsPerRow = 4; // Kolom [1, 2, 3, 4]
        return rows.length * seatsPerRow;
    };

    const handleCheckout = async () => {
        if (selectedSeats.length === 0) {
        Alert.alert("Hold Up!", "you haven't chosen any seat yet. Please select at least one seat to proceed...");
        return;
        }

        try {
        const storageKey = `@booking_${selectedDate}_${shippingType}`;

        const existingData = await AsyncStorage.getItem(storageKey);
        const bookings = existingData ? JSON.parse(existingData) : [];

        const currentBookedSeats = bookings.flatMap((item: any) => item.seats);

        const maxTotalSeats = getTotalCapacity(shippingType);
        const remainingSeats = maxTotalSeats - currentBookedSeats.length;

        // Logic : if number of selected = total seats - booked seats : DESTROY 
        if (selectedSeats.length === remainingSeats) {
            Alert.alert(
            "It's Fully Booked!",
            `All seats in ${shippingType} at ${selectedDate} have been booked. The seats for this service and date will reset.`,
            [
                {
                text: "OK",
                onPress: async () => {
                    await AsyncStorage.removeItem(storageKey);
                    setBookedSeats([]);
                    setSelectedSeats([]);
                    router.replace("/");
                },
                },
            ],
            );
        } else {
            const newBooking = {
            id: Date.now().toString(),
            date: selectedDate,
            shippingType: shippingType,
            seats: selectedSeats,
            totalPrice: calculateTotalPrice(),
            createdAt: new Date().toISOString(),
            };

            bookings.push(newBooking);

            // save to AsyncStorage
            await AsyncStorage.setItem(storageKey, JSON.stringify(bookings));

            Alert.alert(
            "Success!",
            `Booking for ${selectedDate} (${shippingType}) with seat(s) [${selectedSeats.join(", ")}] successfully added!`,
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
        console.error("failed to save:", error);
        Alert.alert(
            "Error",
            "something unexpected happend.",
        );
        }
    };

    return (
        <View>
            <ScrollView contentContainerStyle={{ paddingBottom: 265, paddingVertical: 20, ...globalStyles.container }} showsVerticalScrollIndicator={false}>
                <Text style={{marginVertical: 20, ...globalStyles.title}}>Book your Seat</Text>
                <View style={globalStyles.blockVertical}>
                    <Text style={globalStyles.label}>Select the date:</Text>
                    <DateSelector onDateChange={handleDateChange} />
                </View>

                {/* (Regular / Express) */}
                <View style={globalStyles.blockVerticalThin}>
                    <ServiceSelector
                        selected={shippingType}
                        onSelect={handleShippingChange}
                        />
                </View>

                {/* Grid seat */}
                <View style={globalStyles.blockVertical}>
                    <Text style={{...globalStyles.label, marginBottom: 15}}>Choose seat (Max 5)</Text>
                <SeatGrid
                    bookedSeats={bookedSeats} 
                    shippingType={shippingType}
                    selectedSeats={selectedSeats}
                    onSeatChange={setSelectedSeats}
                    />
                </View>

            </ScrollView>
                <View style={globalStyles.blockFixedBottom}>
                    <PriceBox selectedSeats={selectedSeats} shippingType={shippingType} />

                    <View style={{flexDirection: 'row', gap: 15}}>
                    <TouchableOpacity style={{...globalStyles.ButtonLarge, ...globalStyles.darkButton}} onPress={() => router.back()}>
                        <Text style={globalStyles.primaryText}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{...globalStyles.ButtonLarge, ...globalStyles.primaryButton, flex: 2}}
                        onPress={handleCheckout}
                        activeOpacity={0.8}
                        >
                        <Text style={globalStyles.primaryText}>Confirm</Text>
                    </TouchableOpacity>
                    </View>

                </View>
        </View>
    );
}