import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="user-informations" options={{
                title: "Mes informations",
            }} />
            <Stack.Screen name="redaction" />
            <Stack.Screen name="index" options={{
                title: "Accueil"
            }} />
             <Stack.Screen name="emergencies/[...location]" options={{
                title: "Demande de contact urgent",
            }} />
        </Stack>
    )
}