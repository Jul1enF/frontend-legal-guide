import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
          
        }}>
            <Stack.Screen name="press/[articleIndex]" options={{
                title : "Presse",
            }} />
             <Stack.Screen name="press-article/[...infos]" options={{
                title: "Article de presse",
            }} />
        </Stack>
    )
}