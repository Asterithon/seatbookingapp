import { Stack } from "expo-router";
import { colors } from "./styles/global";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: colors.primary }, headerTintColor: colors.white }}>
      <Stack.Screen name="index" options={{ headerShown: false, title: 'home' }} />
      <Stack.Screen name="book" options={{ title: 'Booking' }} />
      <Stack.Screen name="bookList" options={{ title: 'History' }} />
    </Stack>
  )
}
