import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,

        }}>
            <Stack.Screen name="connection" options={{
                title: "Connexion",
            }} />
            <Stack.Screen name="signin" options={{
                title: "Se connecter",
            }} />
            <Stack.Screen name="signup" options={{
                title: "S'inscire",
            }} />
        </Stack>
    )
}