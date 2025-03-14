import { Dimensions, Platform, StatusBar } from "react-native";
import { getNavigationBarHeight, getNavigationBarHeightAsync } from "react-native-android-navbar-height";


const screenHeight = Dimensions.get('window').height;

const fullScreenHeight = Dimensions.get('screen').height

const screenWidth = Dimensions.get('window').width;

const statusHeight = StatusBar.currentHeight



const navigationHeight = getNavigationBarHeight()



const RPH = (percentage) => {

    // console.log("screenHeight :", screenHeight)
    // console.log("fullScreenHeight :", fullScreenHeight)
    // console.log("statusHeight :", statusHeight)
    // console.log("soustraction :", fullScreenHeight-screenHeight)

    if (Platform.OS === "android"){
        if (screenHeight !== fullScreenHeight && fullScreenHeight - screenHeight !== statusHeight ){
            return (percentage / 100) * (screenHeight + statusHeight)
        }
        else if (screenHeight !== fullScreenHeight){
            return (percentage / 100) * screenHeight;
        }
        else{
            return (percentage / 100) * (screenHeight - navigationHeight);
            // return (percentage / 100) * (screenHeight);
        }
    }
    else {
        return (percentage / 100) * screenHeight;
    }
};

const RPW = (percentage) => {
    return (percentage / 100) * (screenWidth);
};


module.exports = { RPH, RPW }