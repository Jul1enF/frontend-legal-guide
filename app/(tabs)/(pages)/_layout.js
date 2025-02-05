import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="settings" />
            <Stack.Screen name="redaction" />
        </Stack>
    )
}