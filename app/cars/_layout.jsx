import { Stack } from 'expo-router';

export default function CarsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" />
      <Stack.Screen name="add-car-step1" />
      <Stack.Screen name="add-car-step2" />
      <Stack.Screen name="add-car-step3" />
      <Stack.Screen name="add-car-scheduler" />
      <Stack.Screen name="edit-car" />
    </Stack>
  );
}