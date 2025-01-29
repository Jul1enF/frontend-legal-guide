import { Stack } from "expo-router";

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import user from '../reducers/user'
import testArticle from '../reducers/testArticle'
import articles from '../reducers/articles'


const store = configureStore({
    reducer: { user, testArticle, articles },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false })
})

export default function RootLayout() {

    return (
        <Provider store={store}>
            <Stack >
                <Stack.Screen name="index" options={{
                    headerShown: false,
                    title: "Accueil",
                }} />
                <Stack.Screen name="(tabs)" options={{
                    headerShown: false,
                }} />
            </Stack>
        </Provider>
    )
}