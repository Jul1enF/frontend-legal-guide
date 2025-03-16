
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

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

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Highest,
        deferredUpdatesInterval: 60000,
    });
};



// Arrêter la localisation

const stopLocation = async () => {
    console.log("BG LOCATION STOPPED !")
    await TaskManager.unregisterAllTasksAsync()
}




// Tâche background de Task Manager
// TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
//     if (error) {
//         console.log("TASK MANAGER ERROR", error)
//         return;
//     }
//     if (data) {
//         await AsyncStorage.setItem("lastBgLocationDate", new Date().toISOString())

//         const { locations } = data;
//         console.log("BACKGROUND LOCATION :", locations)

//         const i = locations.length - 1
//         const lastLocation = locations[i]

//         const lastFetchTimestamp = await AsyncStorage.getItem("fetch-timestamp")

//         console.log("LAST FETCH TIME STAMP", lastFetchTimestamp)

//         if(lastFetchTimestamp){
//             console.log("TIME DIFFERENCE", lastLocation.timestamp - Number(lastFetchTimestamp))
//         }

//         if (lastFetchTimestamp && lastLocation.timestamp - Number(lastFetchTimestamp) < 61000){
//             console.log("TOO SOON TO FETCH")
//             return
//         }

//         await AsyncStorage.setItem("fetch-timestamp", lastLocation.timestamp.toString())

//         const lat = lastLocation.coords.latitude
//         const long = lastLocation.coords.longitude
//         const user_location = [lat, long]

//         const url = process.env.EXPO_PUBLIC_BACK_ADDRESS

//         const _id = await AsyncStorage.getItem("emergency-id")

//         console.log("STORAGE ID", _id)

//         if (_id) {
//             const response = await fetch(`${url}/emergencies/update-location`, {
//                 method: 'PUT',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ _id, user_location })
//             })

//             const fetchData = await response.json()

//             console.log("FETCH DATA", fetchData)
//             if (!fetchData.result && fetchData.error === "No more emergency in data base") {
//                 stopLocation()
//             }
//         }
//     }
// });


TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
    if (error) {
        console.log("TASK MANAGER ERROR", error)
        return;
    }
    if (data) {
        AsyncStorage.setItem("lastBgLocationDate", new Date().toISOString()).then(() => {
            const { locations } = data;
            console.log("BACKGROUND LOCATION :", locations)

            const i = locations.length - 1
            const lastLocation = locations[i]

            AsyncStorage.getItem("fetch-timestamp").then((lastFetchTimestamp) => {
                console.log("LAST FETCH TIME STAMP", lastFetchTimestamp)

                if (lastFetchTimestamp) {
                    console.log("TIME DIFFERENCE", lastLocation.timestamp - Number(lastFetchTimestamp))
                }

                if (lastFetchTimestamp && lastLocation.timestamp - Number(lastFetchTimestamp) < 45000) {
                    console.log("TOO SOON TO FETCH")
                    return
                }

                AsyncStorage.setItem("fetch-timestamp", lastLocation.timestamp.toString()).then(() => {

                    const lat = lastLocation.coords.latitude
                    const long = lastLocation.coords.longitude
                    const user_location = [lat, long]

                    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS

                    AsyncStorage.getItem("emergency-id").then((_id) => {
                        console.log("STORAGE ID", _id)

                        if (_id) {
                            fetch(`${url}/emergencies/update-location`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ _id, user_location })
                            })
                                .then((response) => response.json())
                                .then((fetchData) => {
                                    console.log("FETCH DATA", fetchData)
                                    if (!fetchData.result && fetchData.error === "No more emergency in data base") {
                                        stopLocation()
                                    }
                                })
                        }

                    })

                })
            })
        })
    }
});



module.exports = { startBackgroundLocation, stopLocation, askLocationPermissions }

