import { Stack } from "expo-router";
import { useEffect, useState, useRef } from "react";

import * as Notifications from 'expo-notifications';

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import user from '../reducers/user'
import testArticle from '../reducers/testArticle'
import articles from '../reducers/articles'
import emergencies from "../reducers/emergencies";

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();

import { KeyboardProvider } from "react-native-keyboard-controller";


const store = configureStore({
    reducer: { user, testArticle, articles, emergencies },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false })
})

export default function RootLayout() {

    // NOTIFICATIONS

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        }),
    });

    const [notification, setNotification] = useState('');
    const notificationListener = useRef('');
    const responseListener = useRef('');



    useEffect(() => {
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            notificationListener.current &&
                Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current &&
                Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, [])





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
            <KeyboardProvider>
                <Stack >
                    <Stack.Screen name="home" options={{
                        headerShown: false,
                        title: "Home",
                    }} />
                    <Stack.Screen name="(tabs)" options={{
                        headerShown: false,
                    }} />
                </Stack>
            </KeyboardProvider>
        </Provider>
    )
}