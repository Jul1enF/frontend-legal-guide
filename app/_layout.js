import { Stack } from "expo-router";
import { useEffect } from "react";

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import user from '../reducers/user'
import testArticle from '../reducers/testArticle'
import articles from '../reducers/articles'
import emergencies from "../reducers/emergencies";

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();


const store = configureStore({
    reducer: { user, testArticle, articles, emergencies },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false })
})

export default function RootLayout() {

    // FONTS
    const [loaded, error] = useFonts({
        'Barlow-ExtraLight': require('../assets/fonts/BarlowCondensed-ExtraLight.ttf'),
        'Barlow-Light': require('../assets/fonts/BarlowCondensed-Light.ttf'),
        'Barlow-Regular': require('../assets/fonts/BarlowCondensed-Regular.ttf'),
        'Barlow-Medium': require('../assets/fonts/BarlowCondensed-Medium.ttf'),
        'Barlow-SemiBold': require('../assets/fonts/BarlowCondensed-SemiBold.ttf'),
        'Barlow-Bold': require('../assets/fonts/BarlowCondensed-Bold.ttf'),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    // Ne pas charger la page si les polices n'ont pas été chargées
    if (!loaded && !error) {
        return null;
    }





    return (
        <Provider store={store}>
            <Stack >
                <Stack.Screen name="home" options={{
                    headerShown: false,
                    title: "Home",
                }} />
                <Stack.Screen name="(tabs)" options={{
                    headerShown: false,
                }} />
            </Stack>
        </Provider>
    )
}