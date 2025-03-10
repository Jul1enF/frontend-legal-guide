
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

const LOCATION_TASK_NAME = 'background-location-task';



// import AsyncStorage from '@react-native-async-storage/async-storage';


// const defineAndLaunchTask = async () => {
//     await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
//         accuracy: Location.Accuracy.Balanced,
//         // deferredUpdatesDistance : 1,
//         // distanceInterval : 10,
//         deferredUpdatesInterval: 1000,
//         timeInterval: 2000,
//     });
// }



// Activation de la localisation

// const startBackgroundLocation = async () => {

//     const { status } = await Location.requestForegroundPermissionsAsync();

//     let currentLocation = []

//     if (status === 'granted') {

//         const locationData = await Location.getCurrentPositionAsync()

//         currentLocation = [locationData.coords.latitude, locationData.coords.longitude]

//         console.log("CURRENT POSITION", currentLocation)


//         Location.requestBackgroundPermissionsAsync().then(() => {
//             if (res.status === 'granted') {
//                 console.log("PERMISSION ALREADY GIVEN")
//                 defineAndLaunchTask()
//                 return currentLocation
//             }
//             if (AppState.currentState === 'active') {
//                 console.log("PERMISSION DENIED")
//                 return currentLocation
//             }
//             AppState.addEventListener('change', (state) => {
//                 if (state === 'active') {
//                     Location.getBackgroundPermissionsAsync().then((res) => {
//                         if (res.status === 'granted') {
//                             defineAndLaunchTask()
//                             return currentLocation
//                         } else {
//                             return currentLocation
//                         }
//                     });
//                 }
//             });
//         });
//     }else {
//         return currentLocation
//     }
// };

const startBackgroundLocation = async () => {

    console.log('STARTING BG LOCATION')

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        // deferredUpdatesDistance : 1,
        // distanceInterval : 10,
        deferredUpdatesInterval: 2000,
        // timeInterval: 2000,
    });

    const registeredTasks = await TaskManager.getRegisteredTasksAsync()

    console.log("REGISTERED TASKS", registeredTasks)

    const taskManagerAvailable = await TaskManager.isAvailableAsync()

    console.log("TASK MANAGER AVAILABLE", taskManagerAvailable)

};

// console.log('STARTING BG LOCATION')


// Arrêter la localisation

const stopLocation = async () => {
    console.log("BG LOCATION STOPPED !")
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME)
}



// Tâche background de Task Manager
TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
    if (error) {
        console.log("TASK MANAGER ERROR", error)
        return;
    }
    if (data) {
        const { locations } = data;
        console.log("BACKGROUND LOCATION :", locations)

        const lat = locations[0].coords.latitude
        const long = locations[0].coords.longitude
        const user_location = [lat, long]

        console.log("USER LOCATION", user_location)
    }
});



module.exports = { startBackgroundLocation, stopLocation }

