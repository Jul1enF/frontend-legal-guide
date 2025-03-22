
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

import AsyncStorage from "@react-native-async-storage/async-storage";


const LOCATION_TASK_NAME = 'background-location-task';


const askLocationPermissions = async () => {
    let userCurrentLocation = []

    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();

    console.log("FOREGROUND STATUS", foregroundStatus)

    if (foregroundStatus === 'granted') {

        const locationData = await Location.getCurrentPositionAsync()

        userCurrentLocation = [locationData.coords.latitude, locationData.coords.longitude]
        console.log("USER LOCATION", userCurrentLocation)


        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();

        if (backgroundStatus === 'granted') {
            console.log("FIRST PERMISSION GRANTED")
            startBackgroundLocation()

            return { userCurrentLocation, backgroundLocation: true }
        } else {
            return { userCurrentLocation, backgroundLocation: false }
        }
    } else {
        return { userCurrentLocation, backgroundLocation: false }
    }
}



const startBackgroundLocation = async () => {

    console.log('STARTING BG LOCATION')

    if (Platform.OS === "ios"){
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.Highest,
            //only apply when the app is backgrounded and was implemented to save battery by being able to update locations in batches from the background.
            deferredUpdatesInterval: 121000,
        });
    }else{
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.Highest,
            deferredUpdatesInterval: 61000,
            deferredUpdatesDistance: 0,
            foregroundService: {
                notificationTitle: "Me Baudelin - Localisation",
                notificationBody: "Me Baudelin utilise votre localisation",
                killServiceOnDestroy : false,
            },
        });
    }
};



// Arrêter la localisation

const stopLocation = async () => {
    console.log("BG LOCATION STOPPED !")
    await TaskManager.unregisterAllTasksAsync()
}




//Tâche background de Task Manager

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
        console.log("TASK MANAGER ERROR", error)
        return;
    }
    if (data) {

        const { locations } = data;
        console.log("BACKGROUND LOCATION :", locations)

        const i = locations.length - 1
        const lastLocation = locations[i]

        const lastFetchTimestamp = await AsyncStorage.getItem("fetch-timestamp")

        if (lastFetchTimestamp && lastLocation.timestamp - Number(lastFetchTimestamp) < 120000 && Platform.OS === "ios") {
            console.log("TOO SOON TO FETCH")
            return
        }

        if (lastFetchTimestamp && lastLocation.timestamp - Number(lastFetchTimestamp) < 60000 && Platform.OS === "android") {
            console.log("TOO SOON TO FETCH")
            return
        }

        await AsyncStorage.setItem("fetch-timestamp", lastLocation.timestamp.toString())

        const lat = lastLocation.coords.latitude
        const long = lastLocation.coords.longitude

        const url = process.env.EXPO_PUBLIC_BACK_ADDRESS

        const _id = await AsyncStorage.getItem("emergency-id")

        console.log("STORAGE ID", _id)

        if (_id) {
            const response = await fetch(`${url}/emergencies/update-location/${lat}/${long}/${_id}`)

            const fetchData = await response.json()

            console.log("FETCH DATA", fetchData)
            if (!fetchData.result && fetchData.error === "No more emergency in data base") {
                await stopLocation()
            }
        }
    }
});





module.exports = { startBackgroundLocation, stopLocation, askLocationPermissions }

