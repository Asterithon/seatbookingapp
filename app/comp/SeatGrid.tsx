import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors } from '../styles/global';

interface SeatGridProps {
  shippingType: string;
  selectedSeats: string[];
  bookedSeats: string[];
  onSeatChange: (seats: string[]) => void;
}

export default function SeatGrid({ 
  shippingType, 
  selectedSeats, 
  bookedSeats,
  onSeatChange 
}: SeatGridProps) {
  
  const MAX_LIMIT = 5;

  const handleSeatPress = (seatName: string) => {
    let updatedSeats: string[];

    if (selectedSeats.includes(seatName)) {
      // Unselect 
      updatedSeats = selectedSeats.filter((seat) => seat !== seatName);
    } else {
      // Limit
      if (selectedSeats.length >= MAX_LIMIT) {
        return; 
      }
      // Select
      updatedSeats = [...selectedSeats, seatName];
    }

    onSeatChange(updatedSeats); 
  };

  const rows = shippingType === 'regular' ? ['A', 'B', 'C', 'D', 'E'] : ['A', 'B', 'C'];

  const renderSeatGroup = (row: string, seatNumbers: number[]) => (
    <View style={styles.sideGroup}>
      {seatNumbers.map((num) => {
        const seatName = `${row}${num}`;
        
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

              (isBooked || (isMaxReached && !isSelected)) && styles.disabledSeat,

            ]}
            onPress={() => handleSeatPress(seatName)}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.text, 
              isSelected && styles.textSelected,

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
    width: 60,
    aspectRatio: 1,
  },
  expressSize: {
    width: 60,
    aspectRatio: 1 / 1.8,
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
    color: colors.text,
  },
  textSelected: {
    color: colors.white,
  },
});