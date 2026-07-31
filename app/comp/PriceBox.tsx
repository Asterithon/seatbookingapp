import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {globalStyles} from "../styles/global";
import { colors } from "../styles/global";

interface PriceBoxProps {
    selectedSeats: string[];
    shippingType: string;

}

export default function PriceBox({ selectedSeats, shippingType }: PriceBoxProps) {
    const calculatePrice = () => {
        let total = 0;
        selectedSeats.forEach(seat => {
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
    const totalPrice = calculatePrice();

    return (
    <View style={styles.container}>
        <View style={styles.row}>
            <Text style={styles.label}>Seat(s) chosen:</Text>
            <Text style={styles.value}>
                {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Belum ada'}
            </Text>
        </View>

        <View style={styles.row}>
            <Text style={styles.label}>Total seats:</Text>
            <Text style={styles.value}>{selectedSeats.length} Seats</Text>
        </View>

        <View style={[styles.row, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Price:</Text>
            <Text style={styles.totalValue}>
                Rp {totalPrice.toLocaleString('id-ID')}
            </Text>
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
        marginTop: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: '#6c757d',
    },
    value: {
        fontSize: 14,
        fontWeight: '600',
        color: '#343a40',
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: '#dee2e6',
        paddingTop: 10,
        marginTop: 4,
        marginBottom: 0,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#212529',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007AFF',
    },
});