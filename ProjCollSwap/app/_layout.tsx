import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="register-success" options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      <Stack.Screen name="reset-password" options={{ headerShown: false }} />
      <Stack.Screen name="reset-success" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="not-found" options={{ headerShown: false }} />
      <Stack.Screen name="abilities-mode-digimon" options={{ headerShown: false }} />
      <Stack.Screen name="abilities-mode-overwatch" options={{ headerShown: false }} />
      <Stack.Screen name="abilities-mode-warframe" options={{ headerShown: false }} />
      <Stack.Screen name="abilities-classic-mode-digimon" options={{ headerShown: false }} />
      <Stack.Screen name="abilities-classic-mode-overwatch" options={{ headerShown: false }} />
      <Stack.Screen name="abilities-classic-mode-warframe" options={{ headerShown: false }} />
      <Stack.Screen name="splashart-mode-digimon" options={{ headerShown: false }} />
      <Stack.Screen name="splashart-mode-overwatch" options={{ headerShown: false }} />
      <Stack.Screen name="splashart-mode-warframe" options={{ headerShown: false }} />
    </Stack>
  );
}