import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,

        }}>
            <Stack.Screen name="advices/[articleIndex]" options={{
                title: "Conseils",
            }} />
            <Stack.Screen name="advices-article/[...infos]" options={{
                title: "Conseil",
            }} />
        </Stack>
    )
}