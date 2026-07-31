import {StyleSheet, Text, View} from "react-native";
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
    <View>
        <View style={styles.row}>
            <Text style={styles.label}>Seat(s) chosen:</Text>
            <Text style={styles.value}>
                {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'you haven\'t chosen yet'}
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: colors.text,
    },
    value: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: colors.lightGray,
        paddingTop: 10,
        marginTop: 4,
        marginBottom: 0,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    totalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.secondary,
    },
});