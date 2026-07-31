import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors } from '../styles/global';

interface SeatGridProps {
  shippingType: string;
  selectedSeats: string[]; // Menerima data kursi terpilih langsung dari parent
  bookedSeats: string[];
  onSeatChange: (seats: string[]) => void;
}

export default function SeatGrid({ 
  shippingType, 
  selectedSeats, // Terima sebagai prop
  bookedSeats,
  onSeatChange 
}: SeatGridProps) {
  
  const MAX_LIMIT = 5;

  const handleSeatPress = (seatName: string) => {
    let updatedSeats: string[];

    if (selectedSeats.includes(seatName)) {
      // Unselect (hapus dari array)
      updatedSeats = selectedSeats.filter((seat) => seat !== seatName);
    } else {
      // Cek batas maksimal 5 kursi
      if (selectedSeats.length >= MAX_LIMIT) {
        return; 
      }
      // Tambahkan kursi baru
      updatedSeats = [...selectedSeats, seatName];
    }

    onSeatChange(updatedSeats); // Kirim array terbaru ke parent
  };

  const rows = shippingType === 'regular' ? ['A', 'B', 'C', 'D', 'E'] : ['A', 'B', 'C'];

  const renderSeatGroup = (row: string, seatNumbers: number[]) => (
    <View style={styles.sideGroup}>
      {seatNumbers.map((num) => {
        const seatName = `${row}${num}`;
        
        // Pengecekan status murni berdasarkan prop dari parent
        const isSelected = selectedSeats.includes(seatName);
        const isBooked = bookedSeats.includes(seatName);
        const isMaxReached = selectedSeats.length >= MAX_LIMIT;
        const isDisabled = isBooked || (isMaxReached && !isSelected);

        return (
          <TouchableOpacity
            key={seatName}
            disabled={isDisabled}
            style={[
              styles.seat,
              shippingType === 'express' ? styles.expressSize : styles.regularSize,
              isSelected && styles.selected,
              // Jika kursi sudah dibooking ATAU melebihi limit, gunakan style disabledSeat yang sama
              (isBooked || (isMaxReached && !isSelected)) && styles.disabledSeat,
            ]}
            onPress={() => handleSeatPress(seatName)}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.text, 
              isSelected && styles.textSelected,
              // Teks untuk kursi yang dibooking ikut meredup menyesuaikan style disabled
              (isBooked || (isMaxReached && !isSelected)) && styles.text
            ]}>
              {seatName}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      {rows.map((row) => (
        <View key={row} style={styles.rowContainer}>
          {renderSeatGroup(row, [1, 2])}
          <View style={styles.aisle} />
          {renderSeatGroup(row, [3, 4])}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sideGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  aisle: {
    width: 30,
  },
  seat: {
    backgroundColor: colors.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  regularSize: {
    width: 45,
    aspectRatio: 1,
  },
  expressSize: {
    width: 45,
    aspectRatio: 1 / 1.5,
  },
  selected: {
    backgroundColor: colors.primary,
    borderColor: colors.secondary,
  },
  disabledSeat: {
    backgroundColor: colors.lightGray,
    borderColor: colors.black,
    opacity: 0.4,
  },
  bookedSeat: {
    backgroundColor: colors.gray,
    borderColor: colors.gray,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  textSelected: {
    color: '#fff',
  },
});