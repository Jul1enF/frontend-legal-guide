
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

const LOCATION_TASK_NAME = 'background-location-task';


const askLocationPermissions = async ()=>{
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

            return { userCurrentLocation, backgroundLocation : true}
        }else{
            return { userCurrentLocation, backgroundLocation : false}
        }
    }else{
        return { userCurrentLocation, backgroundLocation : false}
    }
}



const startBackgroundLocation = async () => {

    console.log('STARTING BG LOCATION')

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        // deferredUpdatesDistance : 1,
        // distanceInterval : 10,
        deferredUpdatesInterval: 1000,
        timeInterval: 1000,
    });
};



// Arrêter la localisation

const stopLocation = async () => {
    console.log("BG LOCATION STOPPED !")
    await TaskManager.unregisterAllTasksAsync()
}



// Tâche background de Task Manager
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
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



module.exports = { startBackgroundLocation, stopLocation, askLocationPermissions }

