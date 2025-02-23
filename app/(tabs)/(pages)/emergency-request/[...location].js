
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router'
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Modal, TextInput, Image } from 'react-native';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRequest, supressRequest } from '../../../../reducers/emergencies';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { RPH, RPW } from '../../../../modules/dimensions'

import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { useVideoPlayer, VideoView } from 'expo-video';

import JWT, { SupportedAlgorithms } from 'expo-jwt';
const jwtKey = process.env.EXPO_PUBLIC_JWT_KEY

// import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';



export default function EmergencyRequest() {
    const router = useRouter()

    const { location } = useLocalSearchParams()
    let previousLocation

    if (location[0] === "index") {
        previousLocation = ''
    } else if (location.length > 1) {
        previousLocation = location.join('/')
    } else {
        previousLocation = location[0]
    }

    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS
    const user = useSelector((state) => state.user.value)
    const emergencies = useSelector((state) => state.emergencies.value)
    const dispatch = useDispatch()

    const [firstname, setFirstname] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [mediaLink, setMediaLink] = useState('')
    const [mediaType, setMediaType] = useState('')
    const [mediaMimeType, setMediaMimeType] = useState('')
    const [mediaExtension, setMediaExtension] = useState('')
    const [emergencyReason, setEmergencyReason] = useState('')

    const [uploading, setUploading] = useState(false)

    const [error, setError] = useState('')
    const [error2, setError2] = useState("")

    const [modal1Visible, setModal1Visible] = useState(false)
    const [modal2Visible, setModal2Visible] = useState(false)


    // UseEffect pour charger dans les états les valeurs des informations du user

    useEffect(() => {
        setFirstname(user.firstname)
        setName(user.name)
        setPhone(user.phone)
    }, [])




    // Fonction et useFocusEffect pour vérifier s'il y a une demande en cours en bdd

    const checkEmergency = async () => {
        if (!emergencies.request._id) {
            return
        }

        const response = await fetch(`${url}/emergencies/check-emergency/${emergencies.request._id}`)

        const data = await response.json()

        if (data.result && data.requestDeleted){
            dispatch(supressRequest())
        }
    }

     useFocusEffect(useCallback(() => {
          checkEmergency()
        }, [emergencies]))



    // Header en sticky pour la scrollView/KeyboardAvoidingView

    const Header = () => {
        return (
            <View style={styles.header} >
                <TouchableOpacity style={styles.headerSection} onPress={() => previousLocation ? router.push(`/${previousLocation}`) : router.back('/')}>
                    <FontAwesome5 name="chevron-left" color="white" size={RPW(4.2)} style={styles.icon} />
                    <Text style={styles.headerText}>Retour</Text>
                </TouchableOpacity>
            </View>
        )
    }




    // Fonction pour annuler les renseignements du formulaire

    const cancelPress = () => {
        !user.firstname && setFirstname("")
        !user.name && setName("")
        !user.phone && setPhone("")
        setMediaLink("")
        setMediaType("")
        setMediaMimeType("")
        setMediaExtension("")
        setEmergencyReason("")
    }




    // Fonction appelée en cliquant sur Choisir une image

    const chooseMedia = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: false,
            allowsMultipleSelection: false,
            quality: 1,
            videoQuality : ImagePicker.UIImagePickerControllerQualityType.Low
        });

        if (!result.canceled) {
            const {uri} = result.assets[0]

            setMediaType(result.assets[0].type)
            setMediaMimeType(result.assets[0].mimeType)

            const name = result.assets[0].fileName
            const nameDisassembled = name.split(".")
            const extension = nameDisassembled[nameDisassembled.length - 1]

            setMediaExtension(extension)

            if (result.assets[0].type === "image"){
                const image = ImageManipulator.ImageManipulator.manipulate(uri)

                const transform = image.resize({
                    width : result.assets[0].width/3.5,
                    height : result.assets[0].height/3.5
                })
                const imageRef = await transform.renderAsync();
                const imageSaved = await imageRef.saveAsync({base64 : false, compress: 0.5, format: extension})

                console.log("IMAGE SAved",imageSaved)

                setMediaLink(imageSaved.uri);

            }else {
                setMediaLink(result.assets[0].uri);
            }
            
        }
    };





    // Fonction de vérification appelée au premier clique sur envoyer

    const validationPress = () => {

        if (!firstname || !name || !phone) {
            setError("Merci de renseigner toutes vos informations de contact !")
            setTimeout(() => setError(''), 3000)
            return
        }
        else if (!emergencyReason) {
            setError("Merci de renseigner la raison de votre demande !")
            setTimeout(() => setError(''), 3000)
            return
        }
        else {
            setModal1Visible(true)
        }
    }






    // Fonction appelée en cliquant définitivement sur envoyer

    const sendRef = useRef(true)

    const sendPress = async (withLocation) => {
        // LOGIQUE LOCALISATION
        const user_location = [48.812554, 2.281467]

        if (!sendRef.current) { return }
        sendRef.current = false

        setError2("Merci de patienter, envoi de la demande...")

        const formData = new FormData()

        mediaLink && formData.append('emergencyMedia', {
            uri: mediaLink,
            name: `${mediaType}.${mediaExtension}`,
            type: mediaMimeType,
        })

        // Encodage en jwt pour obtenir un string à passer en param, garder des types booléens etc... et gérer les cas où les inputs n'ont pas été remplis

        const emergencyData = JWT.encode({
            user_firstname: firstname,
            user_name: name,
            user_email: user.email ? user.email : "",
            user_phone: phone,
            connected: user.jwtToken ? true : false,
            media_link: mediaLink,
            media_type: mediaType,
            emergency_reason: emergencyReason,
            mediaExtension,
            mediaMimeType,
            user_location,
        }, jwtKey)

        const response = await fetch(`${url}/emergencies/new-emergency/${emergencyData}`, {
            method: 'POST',
            body: formData,
        })

        const data = await response.json()

        if (data.result) {
            setError2("Demande envoyée !")
            setTimeout(() => {
                setError2("")
                cancelPress()
                sendRef.current = true
                setModal1Visible(false)
                dispatch(addRequest({
                    _id: data.savedEmergency._id,
                    located: data.savedEmergency.located
                }))
            }, 2500)
        } else {
            setError2("Problème d'enregistrement de votre demande. Quittez l'appli et reconnectez vous.")
            setTimeout(() => {
                setError2("")
                cancelPress()
                sendRef.current = true
                setModal1Visible(false)
            }, 2500)
        }
    }





    // Fonction appelée en cliquant définitivement sur annuler la demande

    const abortRef = useRef(true)

    const abortRequestPress = async () => {
        if (!abortRef.current){
            return
        }
        abortRef.current = false

        const response = await fetch(`${url}/emergencies/suppress-emergency/${emergencies.request._id}`, { method: 'DELETE' })

        const data = await response.json()

        if (data.result) {
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




    // Vidéo
    const [videoWasLaunched, setVideoWasLaunched] = useState(false)
    const player = useVideoPlayer(mediaLink);






    // Affichage conditionnel si demande en cours
    if (emergencies.request._id) {
        return (
            <View style={{ flex: 1, alignItems: "center", paddingTop : RPW(8) }}>
                <Text style={styles.title}>Demande de contact urgent</Text>
                <View style={styles.titleLine}></View>
                <Text style={[styles.reasonText, {marginTop : RPW(3)}]}>Demande de contact urgent en cours</Text>

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


    return (<>

        {/* <KeyboardAwareScrollView
                       style={{ flex: 1, backgroundColor: "#f9fff4" }}
                       contentContainerStyle={{ alignItems: "center", paddingBottom: RPH(5) }}
                       scrollEnabled={scrollable}
                       bottomOffset={Platform.OS === 'ios' ? RPH(7) : RPH(2)}
                        stickyHeaderIndices={[0]}
                   > */}

        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.body} keyboardVerticalOffset={RPH(14)}  >
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ alignItems: "center", paddingBottom: RPH(5) }}
                keyboardShouldPersistTaps="handled"
                stickyHeaderIndices={[0]}>


                <Header />



                <Text style={styles.title}>Demande de contact urgent</Text>
                <View style={styles.titleLine}></View>


                {!user.jwtToken && <View style={styles.inputContainer} >
                    <TextInput style={styles.input}
                        onChangeText={(e) => {
                            setFirstname(e)
                            setError('')
                        }}
                        value={firstname}
                        placeholder='Votre prénom'
                        placeholderTextColor="#fbfff790">
                    </TextInput>
                </View>}

                {!user.jwtToken && <View style={styles.inputContainer} >
                    <TextInput style={styles.input}
                        onChangeText={(e) => {
                            setName(e)
                            setError('')
                        }}
                        value={name}
                        placeholder='Votre nom'
                        placeholderTextColor="#fbfff790">
                    </TextInput>
                </View>}


                {!user.phone && <View style={styles.inputContainer} >
                    <TextInput style={styles.input}
                        onChangeText={(e) => {
                            setPhone(e)
                            setError('')
                        }}
                        value={phone}
                        placeholder="Votre numéro de téléphone"
                        placeholderTextColor="#fbfff790"
                    >
                    </TextInput>
                </View>}

                <TouchableOpacity style={styles.btn2} onPress={() => chooseMedia()}>
                    <Text style={styles.btnSentence2}>Joindre un média</Text>
                </TouchableOpacity>


                {(mediaType === 'image' && mediaLink) && <View style={styles.imgContainer}>
                    <Image source={{ uri: mediaLink }} style={styles.image}></Image>
                </View>}

                {mediaType === "video" &&
                    <View style={styles.videoContainer}>
                        <VideoView style={styles.video} player={player} allowsPictureInPicture />
                      {Platform.OS === "ios" &&  <FontAwesome5 name="play" size={RPW(16)} style={[styles.playIcon, videoWasLaunched && { display: 'none' }]} onPress={() => {
                            player.play()
                            setVideoWasLaunched(true)
                        }} />}
                    </View>
                }

                {mediaLink && <TouchableOpacity style={styles.btn2} onPress={() => {
                    setMediaLink('')
                    setMediaType('')
                    setMediaMimeType('')
                    setMediaExtension('')
                }}>
                    <Text style={styles.btnSentence2}>Enlever le média</Text>
                </TouchableOpacity>}


                <View style={styles.underlineContainer}>
                    <Text style={styles.reasonText}>
                        Motif de votre de demande :
                    </Text>
                </View>

                <TouchableOpacity style={[styles.btn3, emergencyReason !== "Incident avec la police" && { backgroundColor: "#fffcfc" }]} onPress={() => setEmergencyReason("Incident avec la police")}>
                    <Text style={[styles.btnSentence2, emergencyReason !== "Incident avec la police" && { color: "#0c0000" }]}>Incident avec la police</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.btn3, emergencyReason !== "Procédure urgente" && { backgroundColor: "#fffcfc" }]} onPress={() => setEmergencyReason("Procédure urgente")}>
                    <Text style={[styles.btnSentence2, emergencyReason !== "Procédure urgente" && { color: "#0c0000" }]}>Procédure urgente</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.btn3, emergencyReason !== "Autre urgence" && { backgroundColor: "#fffcfc" }]} onPress={() => setEmergencyReason("Autre urgence")}>
                    <Text style={[styles.btnSentence2, emergencyReason !== "Autre urgence" && { color: "#0c0000" }]}>Autre urgence</Text>
                </TouchableOpacity>


                <Text style={styles.error}>{error}</Text>


                <View style={styles.row}>

                    <TouchableOpacity style={styles.btn} onPress={() => cancelPress()}>
                        <Text style={styles.btnSentence}>
                            Annuler
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btn} onPress={() => validationPress()}>
                        <Text style={styles.btnSentence}>
                            Envoyer
                        </Text>
                    </TouchableOpacity>

                </View>


                <Modal
                    visible={modal1Visible}
                    animationType="slide"
                    style={styles.modal}
                    backdropColor="rgba(0,0,0,0.9)"
                    transparent={true}
                    onRequestClose={() => setModal1Visible(!modal1Visible)}
                >
                    <View style={styles.modalBody}>
                        <Text style={styles.modalText}>Envoyer également votre localisation en temps réel ?</Text>
                        <View style={styles.line}>
                        </View>
                        <Text style={[styles.error2, error2 == "Demande envoyée !" && { color: "green" }]}>
                            {error2}
                        </Text>
                        <View style={styles.btnContainer}>
                            <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.8} onPress={() => sendPress(true)}>
                                <Text style={styles.modalText2}>Oui</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.8} onPress={() => sendPress(false)}>
                                <Text style={styles.modalText2}>Non</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.8} onPress={() => setModal1Visible(false)}>
                                <Text style={styles.modalText2}>Annuler</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>



            </ScrollView>
        </KeyboardAvoidingView>

        {/* </KeyboardAwareScrollView> */}

    </>
    )
}


const styles = StyleSheet.create({
    body: {
        backgroundColor: "#fffcfc",
        flex: 1,
    },
    header: {
        height: RPW(10),
        width: RPW(100),
        marginBottom: RPW(8),
        paddingLeft: RPW(4),
        paddingRight: RPW(4),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#0c0000",
    },
    headerSection: {
        width: RPW(30),
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    icon: {
        marginRight: RPW(3)
    },
    headerText: {
        color: "white",
        fontWeight: "500",
        fontSize: RPW(4.5)
    },
    title: {
        color: "#0c0000",
        fontSize: RPW(8),
        marginBottom: 15,
        fontFamily: "Barlow-Bold",
        letterSpacing: RPW(0),
    },
    titleLine: {
        width: "30%",
        height: 3.5,
        marginBottom: RPW(8),
        marginLeft: RPW(1),
        borderRadius: 15,
        backgroundColor: "rgb(185, 0, 0)",
    },
    inputContainer: {
        marginBottom: RPW(6),
        width: "90%",
        height: RPW(10.5),
        borderRadius: RPW(2),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: RPW(4),
        backgroundColor: "rgb(157, 0, 0)",
    },
    input: {
        flex: 1,
        paddingLeft: RPW(4),
        color: "white",
        fontSize: RPW(5)
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: RPW(100),
    },
    btn: {
        width: RPW(42),
        height: RPW(12),
        borderRadius: RPW(2),
        marginTop: RPW(4),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0c0000",
    },
    btnSentence: {
        color: "#fffcfc",
        fontSize: RPW(5),
        fontWeight: "600"
    },
    btnSentence2: {
        color: "#fffcfc",
        fontSize: RPW(4.8),
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
    imgContainer: {
        width: RPW(50),
        height: RPW(40),
        justifyContent: "center",
        marginTop: RPW(7),
        marginBottom: RPW(5),
    },
    image: {
        resizeMode: "contain",
        height: RPW(40)
    },
    videoContainer: {
        marginTop: RPW(7),
        marginBottom: RPW(4),
        height: 160,
        width: RPW(100),
        alignItems: "center",
        justifyContent: "center",
    },
    video: {
        height: 160,
        width: RPW(100),
    },
    playIcon: {
        position: "absolute",
        color: "white",
    },
    underlineContainer: {
        marginTop: RPW(10),
        borderBottomWidth: 1.5,
        borderBottomColor: "#0c0000",
        paddingBottom: RPW(2.2),
        marginBottom: RPW(5)
    },
    reasonText: {
        fontFamily: "Barlow-SemiBold",
        fontSize: RPW(6.5)
    },
    btn3: {
        width: RPW(60),
        height: RPW(11),
        borderRadius: RPW(2),
        marginTop: RPW(3),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0c0000",
        borderColor: "#0c0000",
        borderWidth: 2,
    },
    error: {
        color: "red",
        fontSize: RPW(4.5),
        fontWeight: "600",
        marginTop: RPH(1)
    },
    modal: {
        alignItems: "center"
    },
    modalBody: {
        height: RPW(66),
        width: RPW(96),
        borderRadius: 10,
        paddingTop: RPW(5),
        paddingBottom: RPW(7),
        paddingLeft: RPW(2),
        paddingRight: RPW(2),
        backgroundColor: "#dfdfdf",
        position: "absolute",
        bottom: RPH(14),
        left: RPW(2),
        justifyContent: "space-between",
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
    modalText: {
        color: "#0c0000",
        fontSize: RPW(6),
        fontWeight: "600",
        textAlign: "center",
        paddingLeft: RPW(5),
        paddingRight: RPW(5),
        lineHeight: RPW(9)
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
    line: {
        width: "90%",
        height: 4,
        marginTop: -RPW(6),
        backgroundColor: "rgb(157, 0, 0)",
    },
    btnContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "100%"
    },
    btnTouchable: {
        width: RPW(25),
        height: RPW(12),
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0c0000",
    },
    modalText2: {
        color: "white",
        fontSize: RPW(5.2),
        fontWeight: "700",
    },
})
