import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from "../styles/global";

interface DateSelectorProps {
  onDateChange: (dateString: string) => void; // format "YYYY-MM-DD"
}

export default function DateSelector({ onDateChange }: DateSelectorProps) {
  const today = new Date();
  
  // Format tanggal ke "YYYY-MM-DD"
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [showPicker, setShowPicker] = useState<boolean>(false);

  React.useEffect(() => {
    onDateChange(formatDate(today));
  }, []);

  const handleDateChange = (event: any, date?: Date) => {
    setShowPicker(Platform.OS === 'ios'); 
    if (date) {
      setSelectedDate(date);
      onDateChange(formatDate(date)); 
    }
  };

  return (
    <View style={styles.container}>
      {/* Tombol pemicu kalender */}
      <TouchableOpacity
        style={styles.dateBtn}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.btnText}>
        Date : {formatDate(selectedDate)}
        </Text>
      </TouchableOpacity>

      {/* Komponen Kalender Bawaan */}
      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          minimumDate={today}
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.dark,
  },
  dateBtn: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray,
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});