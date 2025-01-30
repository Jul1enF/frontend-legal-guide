import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
          
        }}>
            <Stack.Screen name="tab1-article/[_id]" options={{
                title : "Tab1 Article",
            }} />
            <Stack.Screen name="tab1" options={{
                title : "Tab 1",
            }} />
        </Stack>
    )
}