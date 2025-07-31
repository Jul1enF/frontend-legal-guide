import { Platform, Linking } from "react-native";

const AppleAppID = '6743621711';
const GooglePackageName = 'com.baudelin.mebaudelin';

const STORE_CONFIG = {
    ios: {
        deepLink: `itms-apps://itunes.apple.com/app/id${AppleAppID}`,
        fallback: `https://apps.apple.com/app/id${AppleAppID}`,
    },
    android: {
        deepLink: `market://details?id=${GooglePackageName}`,
        fallback: `https://play.google.com/store/apps/details?id=${GooglePackageName}`,
    },
};

const redirectToStores = async () => {
    const platformConfig =
        STORE_CONFIG[Platform.OS] || STORE_CONFIG.android;
    const { deepLink, fallback } = platformConfig;

    try {
        const supported = await Linking.canOpenURL(deepLink);
        await Linking.openURL(supported ? deepLink : fallback);
    } catch (error) {
        console.error('Failed to redirect to app store:', error);
        await Linking.openURL(fallback);
    }
};


module.exports = {redirectToStores }