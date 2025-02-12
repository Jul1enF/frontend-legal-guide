
import { useRouter, useLocalSearchParams } from 'expo-router'
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Modal, TextInput, Image } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { RPH, RPW } from '../../../../modules/dimensions'

import * as ImagePicker from 'expo-image-picker'
import { useVideoPlayer, VideoView } from 'expo-video';

// import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';



export default function Emergencies() {
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
    const dispatch = useDispatch()

    const [firstname, setFirstname] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [mediaLink, setMediaLink] = useState('')
    const [mediaType, setMediaType] = useState('')

    const [error, setError] = useState('')

    const [modal1Visible, setModal1Visible] = useState(false)



    // UseEffect pour charger dans les états les valeurs des informations du user

    useEffect(() => {
        setFirstname(user.firstname)
        setName(user.name)
        setEmail(user.email)
        user.phone && setPhone(user.phone)
    }, [])






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




    // Fonction appelée en cliquant sur Choisir une image

    const chooseMedia = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: false,
            allowsMultipleSelection: false,
            quality: 0.4,
        });

        if (!result.canceled) {
            setMediaLink(result.assets[0].uri);
            setMediaType(result.assets[0].type)
        }
    };





    // Vidéo
    const [videoWasLaunched, setVideoWasLaunched] = useState(false)
    const player = useVideoPlayer(mediaLink);




    return (<>

        {/* <KeyboardAwareScrollView
                       style={{ flex: 1, backgroundColor: "#f9fff4" }}
                       contentContainerStyle={{ alignItems: "center", paddingBottom: RPH(2) }}
                       scrollEnabled={scrollable}
                       bottomOffset={Platform.OS === 'ios' ? RPH(7) : RPH(2)}
                        stickyHeaderIndices={[0]}
                   > */}

        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.body} keyboardVerticalOffset={RPH(14)}  >
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ alignItems: "center", paddingBottom: RPH(2) }}
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
                        placeholder='Nom'
                        placeholderTextColor="#fbfff790">
                    </TextInput>
                </View>}


                {!user.jwtToken && <View style={styles.inputContainer} >
                    <TextInput style={styles.input}
                        onChangeText={(e) => {
                            setEmail(e)
                            setError('')
                        }}
                        value={email}
                        placeholder='Votre Email'
                        placeholderTextColor="#fbfff790"
                        keyboardType='email-address'
                        autoCapitalize='none'>
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


                {mediaType === 'image' && <View style={styles.imgContainer}>
                    <Image source={{ uri: mediaLink }} style={styles.image}></Image>
                </View>}

                {mediaType === "video" &&
                    <View style={styles.videoContainer}>
                        <VideoView style={styles.video} player={player} allowsPictureInPicture />
                        <FontAwesome5 name="play" size={RPW(16)} style={[styles.playIcon, videoWasLaunched && { display : 'none'}]} onPress={()=>{
                            player.play()
                            setVideoWasLaunched(true)
                        }} />
                    </View>
                }

                {mediaLink && <TouchableOpacity style={styles.btn2} onPress={() => {
                    setMediaLink('')
                    setMediaType('')
                    }}>
                    <Text style={styles.btnSentence2}>Enlever le média</Text>
                </TouchableOpacity>}


                <View style={styles.underlineContainer}>
                    <Text style={styles.reasonText}>
                        Motif de votre de demande :
                    </Text>
                </View>


                <Text style={[styles.error, error == "Demande envoyée !" && { color: "green" }]}>{error}</Text>


                <View style={styles.row}>

                    <TouchableOpacity style={styles.btn} onPress={() => cancelPress()}>
                        <Text style={styles.btnSentence}>
                            Annuler
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btn} onPress={() => setModal1Visible(true)}>
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
                        <Text style={styles.modalText}>Fournir également votre localisation en temps réel ?</Text>
                        <View style={styles.line}>
                        </View>
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
        color: "#2a0000",
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
        marginTop: RPW(3),
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
        width : RPW(52),
        height: RPW(11),
        borderRadius: RPW(2),
        marginTop: RPW(3),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0c0000",
    },
    imgContainer: {
        width: RPW(50),
        height: RPW(40),
        justifyContent: "center",
        marginTop: RPW(7),
        marginBottom : RPW(5),
    },
    image: {
        resizeMode: "contain",
        height: RPW(40)
    },
    videoContainer : {
        marginTop: RPW(7),
        marginBottom : RPW(4),
        height: 160,
        width: RPW(100),
        alignItems: "center",
        justifyContent: "center",
    },
    video: {
        height: 160,
        width: RPW(100),
    },
    playIcon : {
        position : "absolute",
        color : "white",
    },
    underlineContainer : {
        marginTop : RPW(14),
        borderBottomWidth : 1.5,
        borderBottomColor :"#0c0000",
        paddingBottom : RPW(2.5)
    },
    reasonText : {
        fontFamily: "Barlow-SemiBold",
        fontSize : RPW(6.5)
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
        height: RPH(35),
        width: RPW(96),
        borderRadius: 10,
        paddingTop: RPH(5),
        paddingBottom: RPH(5),
        paddingLeft: RPW(2),
        paddingRight: RPW(2),
        backgroundColor: "#dfdfdf",
        position: "absolute",
        bottom: RPH(17),
        left: RPW(2),
        justifyContent: "space-between",
        alignItems: "center"
    },
    modalText: {
        color: "#0c0000",
        fontSize: RPW(5.7),
        fontWeight: "600",
        textAlign: "center",
        paddingLeft: RPW(5),
        paddingRight: RPW(5),
        lineHeight: RPH(4)
    },
    line: {
        width: "90%",
        height: 4,
        marginTop: -6,
        backgroundColor: "rgb(157, 0, 0)",
    },
    btnContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "100%"
    },
    btnTouchable: {
        width: RPW(25),
        height: RPW(13),
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
