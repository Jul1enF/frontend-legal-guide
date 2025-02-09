import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
          
        }}>
            <Stack.Screen name="bookmarks" options={{
                title : "Favoris",
            }} />
             <Stack.Screen name="bookmarks-article/[_id]" options={{
                title: "Article favoris",
            }} />
        </Stack>
    )
}