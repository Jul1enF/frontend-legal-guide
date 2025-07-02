import { Stack } from "expo-router";
import { useEffect, useState, useRef } from "react";

import * as Notifications from 'expo-notifications';

import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import user from '../reducers/user'
import testArticle from '../reducers/testArticle'
import articles from '../reducers/articles'
import emergencies from "../reducers/emergencies";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();

import { KeyboardProvider } from "react-native-keyboard-controller";


const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
}

const reducers = combineReducers({ user, testArticle, articles, emergencies })

const store = configureStore({
    reducer: persistReducer(persistConfig, reducers),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
})

const persistor = persistStore(store)





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



    useEffect(() => {
        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            notificationListener.remove();
            responseListener.remove();
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
            <PersistGate persistor={persistor}>
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
            </PersistGate>
        </Provider>
    )
}