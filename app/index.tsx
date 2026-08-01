import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import SeatGrid from "./comp/SeatGrid";
import ServiceSelector from "./comp/ServiceSelect";
import { globalStyles } from "./styles/global";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [shippingType, setShippingType] = useState("regular");
  const router = useRouter();
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);

  const fetchBookedSeats = async (date: string, shipping: string) => {
          if (!date) return;
          try {
          const storageKey = `@booking_${date}_${shipping}`;
          const existingData = await AsyncStorage.getItem(storageKey);

          if (existingData) {
              const parsedData = JSON.parse(existingData);
              const allBooked = parsedData.flatMap((item: any) => item.seats);
              setBookedSeats(allBooked);
          } else {
              setBookedSeats([]); 
          }
          } catch (error) {
          console.error("Gagal memuat data booking:", error);
          }
      };

  useEffect(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        
        fetchBookedSeats(todayStr, shippingType);
    }, [shippingType]); 
  return (
    <View style={globalStyles.container}>
      <Image
        source={require("../assets/images/hero.png")}
        style={{ width: "100%", height: 200, resizeMode: "cover" }}
      />
      <View
        style={[
          globalStyles.blockHorizontal,
          { transform: [{ translateY: "-80%" }], marginBottom: -80 },
        ]}
      >
        <Text style={globalStyles.subtitle}>Try To Book Now!</Text>
        <TouchableOpacity
          style={{...globalStyles.primaryButton, ...globalStyles.Button}}
          activeOpacity={0.8}
          onPress={() => router.push("/book")}
        >
          <Text style={globalStyles.primaryText}>Book</Text>
        </TouchableOpacity>
      </View>
      <View style={globalStyles.blockHorizontal}>
        <Text style={globalStyles.subtitle}>See History</Text>
        <TouchableOpacity
          style={{...globalStyles.primaryButton, ...globalStyles.Button}}
          activeOpacity={0.8}
          onPress={() => router.push("/bookList")}
        >
          <Text style={globalStyles.primaryText}>History</Text>
        </TouchableOpacity>
      </View>
      <View style={globalStyles.blockVertical}>
        <Text style={globalStyles.title}>Today`s Available</Text>
        <ServiceSelector selected={shippingType} onSelect={setShippingType} />
          <SeatGrid
            bookedSeats={bookedSeats} 
            onSeatChange={() => {}}
            selectedSeats={[]} 
            shippingType={shippingType}
          />
      </View>
    </View>
  );
}
