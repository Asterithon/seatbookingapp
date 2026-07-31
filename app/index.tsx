import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import SeatGrid from "./comp/SeatGrid";
import ServiceSelector from "./comp/ServiceSelect";
import { globalStyles } from "./styles/global";

export default function Index() {
  const [shippingType, setShippingType] = useState("regular");
  const router = useRouter();
  return (
    <View style={globalStyles.container}>
      <Image
        source={require("../assets/images/hero.png")}
        style={{ width: "100%", height: 270, resizeMode: "cover" }}
      />
      <View
        style={[
          globalStyles.blockHorizontal,
          { transform: [{ translateY: "-80%" }], marginBottom: -80 },
        ]}
      >
        <Text style={globalStyles.title}>Try To Book Now!</Text>
        <TouchableOpacity
          style={{...globalStyles.primaryButton, ...globalStyles.Button}}
          activeOpacity={0.8}
          onPress={() => router.push("/book")}
        >
          <Text style={globalStyles.primaryText}>Book</Text>
        </TouchableOpacity>
      </View>
      <View style={globalStyles.blockHorizontal}>
        <Text style={globalStyles.title}>See History</Text>
        <TouchableOpacity
          style={{...globalStyles.primaryButton, ...globalStyles.Button}}
          activeOpacity={0.8}
          onPress={() => router.push("/bookList")}
        >
          <Text style={globalStyles.primaryText}>History</Text>
        </TouchableOpacity>
      </View>
      <View style={globalStyles.blockVertical}>
        <Text style={globalStyles.title}>Todays Schedule</Text>
        <ServiceSelector selected={shippingType} onSelect={setShippingType} />
        <View style={globalStyles.blockHorizontal}>
          <SeatGrid
            bookedSeats={[]} // <-- Tambahkan ini, nanti bisa diisi dari AsyncStorage
            onSeatChange={() => {}}
            selectedSeats={[]} // <-- Tambahkan ini
            shippingType={shippingType}
          />
        </View>
      </View>
    </View>
  );
}
