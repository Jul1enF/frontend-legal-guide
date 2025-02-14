import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,

        }}>
            <Stack.Screen name="emergencies-list" options={{
                title: "Liste des urgences",
            }} />
            <Stack.Screen name="emergency/[_id]" options={{
                title: "Urgence détaillée",
            }} />
        </Stack>
    )
}