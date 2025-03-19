
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supressRequest, toggleBackgroundLocation, toggleUserLocationPermission } from '../reducers/emergencies';
import { stopLocation, askLocationPermissions } from '../modules/backgroundLocation'
import { RPH, RPW } from '../modules/dimensions'

import AsyncStorage from "@react-native-async-storage/async-storage";




export default function PendingRequest() {

    const [error2, setError2] = useState("")
    const [modal2Visible, setModal2Visible] = useState(false)

    const dispatch = useDispatch()
    const emergency = useSelector((state) => state.emergencies.value.request)
    console.log("EMERGENCY", emergency)
    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS



    // Phrases conditionnelles du bouton de localisation
    let locationBtnSentence

    if (emergency.backgroundLocation) {
        locationBtnSentence = "Arrêter de me localiser"
    } else {
        locationBtnSentence = "Me localiser en continu"
    }



    // Fonction déclenchant en cliquant sur le bouton de localisation

    const locationPress = async () => {
        if (emergency.backgroundLocation) {
            stopLocation()
            dispatch(toggleBackgroundLocation(false))
            dispatch(toggleUserLocationPermission(false))
        } else {
            const { userCurrentLocation, backgroundLocation } = await askLocationPermissions()

            console.log("PERMISSIONS DATA", userCurrentLocation, backgroundLocation)

            backgroundLocation && dispatch(toggleBackgroundLocation(true))

            dispatch(toggleUserLocationPermission(true))

            if (userCurrentLocation.length > 0){
                const lat = userCurrentLocation[0]
                const long = userCurrentLocation[1]
 
                const response = await fetch(`${url}/emergencies/update-location/${lat}/${long}/${emergency._id}`)
    
                const data = await response.json()
            }
        }
    }



    // Fonction appelée en cliquant définitivement sur annuler la demande

    const abortRef = useRef(true)

    const abortRequestPress = async () => {
        if (!abortRef.current) {
            return
        }
        abortRef.current = false


        let data
        try {
            const response = await fetch(`${url}/emergencies/suppress-emergency/${emergency._id}`, { method: 'DELETE' })

            data = await response.json()
        } catch (err) {
            setError2("Erreur : Problème de connexion")
            setTimeout(() => {
                setError2("")
                abortRef.current = true
                setModal2Visible(false)
            }, 3000)
            return
        }

        if (data.result) {
            stopLocation()
            setError2("Demande annulée !")
            dispatch(supressRequest())
            abortRef.current = true

            // On efface d'asyncStorage l'id de l'urgence
            try {
                await AsyncStorage.setItem("emergency-id", "");
              } catch (e) {
                console.log(e);
              }

            setTimeout(() => {
                setError2("")
                setModal2Visible(false)
            }, 2500)
        } else {
            setError2("Problème d'enregistrement de votre demande. Quittez l'appli et reconnectez vous.")
            setTimeout(() => {
                setError2("")
                abortRef.current = true
                setModal2Visible(false)
            }, 2500)
        }
    }


    // Texte d'avertissement si l'utilisateur a voulu se localiser mais n'a pas activé la localisation en mode "toujours"

    let warning = ""

    if (!emergency.backgroundLocation && emergency.userLocationPermission){
        warning = <Text style={{color : "rgb(221, 1, 1)", fontSize : RPW(4.5), fontWeight : "600", textAlign : "center", position : "absolute", top : RPH(47)}}>Pour activer la localisation en continu, passez l'autorisation de localisation à <Text style={{fontSize : RPW(4.9), fontWeight : "800"}}>"toujours"</Text> dans les réglages de l'app sur le téléphone.</Text>
    }


    return (
        <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={styles.title}>Demande de contact urgent</Text>
            <View style={styles.titleLine}></View>
            <Text style={[styles.reasonText, { marginTop: RPW(3) }]}>Demande de contact urgent en cours</Text>

            <TouchableOpacity style={[styles.btn2, { marginTop: RPW(12) }]} onPress={() => locationPress()}>
                <Text style={styles.btnSentence}>
                    {locationBtnSentence}
                </Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.btn2} onPress={() => setModal2Visible(true)}>
                <Text style={styles.btnSentence}>
                    Annuler la demande
                </Text>
            </TouchableOpacity>

            {warning}

            <Modal
                visible={modal2Visible}
                animationType="slide"
                style={styles.modal}
                backdropColor="transparent"
                transparent={true}
                onRequestClose={() => setModal2Visible(!modal2Visible)}
            >
                <View style={styles.modalBody2}>
                    <Text style={styles.modalText}>Êtes vous sûr de vouloir annuler votre demande de contact urgent ?</Text>
                    <View style={[styles.line, { marginTop: 0 }]}>
                    </View>
                    <Text style={[styles.error2, error2 == "Demande annulée !" && { color: "green" }, { top: RPW(45) }]}>
                        {error2}
                    </Text>

                    <View>
                        <TouchableOpacity style={styles.btn4} activeOpacity={0.8} onPress={() => abortRequestPress()}>
                            <Text style={styles.btnSentence}>Oui, annuler ma demande</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btn4} activeOpacity={0.8} onPress={() => setModal2Visible(false)}>
                            <Text style={styles.btnSentence}>Non, la garder</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>

        </View>
    )
}


const styles = StyleSheet.create({
    title: {
        color: "#0c0000",
        fontSize: RPW(8),
        marginBottom: 15,
        fontFamily: "Barlow-Bold",
        letterSpacing: RPW(0),
    },
    titleLine: {
        width: RPW(30),
        height: 3.5,
        marginBottom: RPW(8),
        marginLeft: RPW(1),
        borderRadius: 15,
        backgroundColor: "rgb(185, 0, 0)",
    },
    reasonText: {
        fontFamily: "Barlow-SemiBold",
        fontSize: RPW(6.5)
    },
    btnSentence: {
        color: "#fffcfc",
        fontSize: RPW(5),
        fontWeight: "600"
    },
    btn2: {
        width: RPW(65),
        height: RPW(11),
        borderRadius: RPW(2),
        marginTop: RPW(8),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0c0000",
        borderColor: "#0c0000",
        borderWidth: 2,
    },
    modal: {
        alignItems: "center"
    },
    modalBody2: {
        height: RPW(90),
        width: RPW(96),
        borderRadius: 10,
        paddingTop: RPW(5),
        paddingBottom: RPW(7),
        paddingLeft: RPW(2),
        paddingRight: RPW(2),
        backgroundColor: "#dfdfdf",
        position: "absolute",
        top: RPH(30),
        left: RPW(2),
        justifyContent: "space-between",
        alignItems: "center"
    },
    modalText: {
        color: "#0c0000",
        fontSize: RPW(6),
        fontWeight: "600",
        textAlign: "center",
        paddingLeft: RPW(5),
        paddingRight: RPW(5),
        lineHeight: RPW(9)
    },
    line: {
        width: "90%",
        height: 4,
        marginTop: -RPW(6),
        backgroundColor: "rgb(157, 0, 0)",
    },
    error2: {
        color: "rgb(157, 0, 0)",
        position: "absolute",
        top: RPW(34),
        fontSize: RPW(4.3),
        fontWeight: "600",
        textAlign: "center",
        lineHeight: RPW(5)
    },
    btn4: {
        width: RPW(70),
        height: RPW(11),
        borderRadius: RPW(2),
        marginTop: RPW(3),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0c0000",
        borderColor: "#0c0000",
        borderWidth: 2,
    },
})