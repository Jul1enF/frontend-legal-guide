import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,

        }}>
            <Stack.Screen name="advices" options={{
                title: "Conseils",
            }} />
            <Stack.Screen name="advices-article/[_id]" options={{
                title: "Conseil",
            }} />
        </Stack>
    )
}