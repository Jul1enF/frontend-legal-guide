import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage'

// Initialize Firebase
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_APP_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage();

const uploadMedia = async (uri, media_name, mediaMimeType) => {

    const response = await fetch(uri)
    const mediaBlob = await response.blob()

    const emergencyMediaRef = ref(storage, `emergenciesMedias/${media_name}`)

    const metadata = {
        contentType: mediaMimeType,
    }

    const uploadedMedia = await uploadBytes(emergencyMediaRef, mediaBlob, metadata);

    const media_url = await getDownloadURL(uploadedMedia.ref)

    return media_url
}

export { uploadMedia }