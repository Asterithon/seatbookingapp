import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DateSelectorProps {
  onDateChange: (dateString: string) => void; // Mengirim format "YYYY-MM-DD" ke parent
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

  // Saat pertama kali dirender, kirim tanggal hari ini ke parent
  React.useEffect(() => {
    onDateChange(formatDate(today));
  }, []);

  // Handler saat tanggal dipilih dari kalender
  const handleDateChange = (event: any, date?: Date) => {
    setShowPicker(Platform.OS === 'ios'); // Di iOS picker tetap tampil, di Android tertutup otomatis
    if (date) {
      setSelectedDate(date);
      onDateChange(formatDate(date)); // Kirim string "YYYY-MM-DD" ke parent
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Pilih Tanggal:</Text>
      
      {/* Tombol pemicu kalender */}
      <TouchableOpacity
        style={styles.dateBtn}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.btnText}>
          📅 {formatDate(selectedDate)}
        </Text>
      </TouchableOpacity>

      {/* Komponen Kalender Bawaan */}
      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          minimumDate={today} // Mencegah pemilihan tanggal yang sudah lewat
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  dateBtn: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ced4da',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});