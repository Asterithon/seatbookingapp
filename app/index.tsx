import { Platform, Text, View, StyleSheet, Button, TouchableOpacity, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';
import { globalStyles } from "./styles/global";
import ShippingSelector from "./comp/ShippingSelect";
import SeatGrid from './comp/SeatGrid';
import { useState, useEffect } from "react";

export default function Index() {
  const [shippingType, setShippingType] = useState('regular');
  const router = useRouter();
  return (
    <View style={globalStyles.container}>
      <Image source={require('../assets/images/hero.png')} style={{ width: '100%', height: 270, resizeMode: 'cover' }} />
      <View style={[globalStyles.blockHorizontal, {transform: [{ translateY: '-40%' }]}]}>
        <Text style={globalStyles.title}>Try To Book Now!</Text>
        <TouchableOpacity style={globalStyles.primaryButton} activeOpacity={0.8} onPress={() => router.push('/book')}>
          <Text style={globalStyles.primaryText}>Book</Text>
        </TouchableOpacity>      
      </View>
      <View style={globalStyles.blockHorizontal}>
        <Text style={globalStyles.title}>See History</Text>
        <TouchableOpacity style={globalStyles.primaryButton} activeOpacity={0.8} onPress={() => router.push('/bookList')}>
          <Text style={globalStyles.primaryText}>History</Text>
        </TouchableOpacity>      
      </View>
      <View style={globalStyles.blockVertical}>
        <Text style={globalStyles.title}>Todays Schedule</Text>
        <ShippingSelector 
          selected={shippingType} 
          onSelect={setShippingType} 
        />
        <View style={globalStyles.blockHorizontal}> 
          <SeatGrid
            bookedSeats={[]} // <-- Tambahkan ini, nanti bisa diisi dari AsyncStorage
            onSeatChange={() => {}}
            selectedSeats={[]} // <-- Tambahkan ini
            shippingType={shippingType} 
          />
          <Text style={globalStyles.subtitle}>Available Seat: </Text>
        </View>
      </View>
    </View>
  );
}
