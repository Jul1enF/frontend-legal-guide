import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
          
        }}>
            <Stack.Screen name="searches/[searchedText]" options={{
                title : "Recherche",
            }} />
            <Stack.Screen name="searches-article/[...search]" options={{
            }}/>
        </Stack>
    )
}