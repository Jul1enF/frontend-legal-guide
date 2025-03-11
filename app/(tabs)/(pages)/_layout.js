import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function RootLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="user-informations" options={{
                title: "Mes informations",
            }} />
            <Stack.Screen name="redaction" options={{
                title : "Rédaction",
            }}
            />
            <Stack.Screen name="index" options={{
                title: "Accueil"
            }} />
             <Stack.Screen name="emergency-request/[...location]" options={{
                title: "Demande de contact urgent",
            }} />
        </Stack>
    )
}