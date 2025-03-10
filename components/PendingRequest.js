
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supressRequest } from '../reducers/emergencies';
import { stopLocation } from '../modules/backgroundLocation'
import { RPH, RPW } from '../modules/dimensions'




export default function PendingRequest() {

    const [error2, setError2] = useState("")
    const [modal2Visible, setModal2Visible] = useState(false)

    const dispatch = useDispatch()
    const emergency = useSelector((state) => state.emergencies.value.request)
    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS





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
            setTimeout(() => {
                setError2("")
                abortRef.current = true
                setModal2Visible(false)
                dispatch(supressRequest())
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


    return (
        <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={styles.title}>Demande de contact urgent</Text>
            <View style={styles.titleLine}></View>
            <Text style={[styles.reasonText, { marginTop: RPW(3) }]}>Demande de contact urgent en cours</Text>

            <TouchableOpacity style={[styles.btn2, { marginTop: RPW(12) }]} onPress={() => setModal2Visible(true)}>
                <Text style={styles.btnSentence}>
                    Annuler la demande
                </Text>
            </TouchableOpacity>

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
        width: RPW(52),
        height: RPW(11),
        borderRadius: RPW(2),
        marginTop: RPW(3),
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