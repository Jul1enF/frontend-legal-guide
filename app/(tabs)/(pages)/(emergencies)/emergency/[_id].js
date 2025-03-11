
import { router, useLocalSearchParams, Link, useFocusEffect } from 'expo-router'
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Platform, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addEmergencies } from '../../../../../reducers/emergencies';
import { useState, useEffect, useRef, useCallback } from 'react';
import moment from 'moment/min/moment-with-locales'
import { useVideoPlayer, VideoView } from 'expo-video';

import { AppleMaps, GoogleMaps } from 'expo-maps';
import { showLocation } from 'react-native-map-link';

import { RPH, RPW } from '../../../../../modules/dimensions'

import { suppressAnEmergency } from '../../../../../reducers/emergencies';

import { useEventListener } from 'expo';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Modal from "react-native-modal"

import * as Location from 'expo-location';



export default function EmergencyDetail() {

    const { _id } = useLocalSearchParams()

    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS
    const user = useSelector((state) => state.user.value)
    const emergencies = useSelector((state) => state.emergencies.value)
    const dispatch = useDispatch()

    const [error, setError] = useState('')

    const [emergency, setEmergency] = useState("")

    const [modalVisible, setModalVisible] = useState(false)


    // UseEffect pour charger la demande de contact urgent et demander l'autorisation de localiser pour apparaitre sur la carte

    const askLocationPermission = async ()=>{
         const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    }

    useEffect(() => {
        askLocationPermission()

        emergencies.emergenciesList.map(e => {
            if (e._id === _id) {
                setEmergency(e)
            }
        })
    }, [emergencies])


    moment.locale('fr')
    const date = moment(emergency.createdAt).format('DD/MM/YYYY')
    const hour = moment(emergency.createdAt).format('LT')






    // Fonction et useFocusEffect pour fetcher les demandes d'urgences
    const getEmergencies = async () => {
        const response = await fetch(`${url}/emergencies/get-emergencies/${user.jwtToken}`)

        const data = await response.json()

        if (!data.result) {
            setError("Erreur : problème de connexion. Données non actualisées. Quittez l'appli et reconnectez vous.")
            setTimeout(() => { setError(''), 4000 })
        }
        else {
            dispatch(addEmergencies(data.emergencies))
            if (!data.emergencies || !data.emergencies.some(e => e._id === _id)) {
                router.back('/emergencies-list')
            }
        }
    }

    useFocusEffect(useCallback(() => {
        getEmergencies()
    }, []))



    // Fonction appelée en cliquant définitivement sur annuler la demande

    const deleteRef = useRef(true)

    const deletePress = async () => {
        if (!deleteRef.current) {
            return
        }
        deleteRef.current = false

        let data
        try {
            const response = await fetch(`${url}/emergencies/suppress-emergency/${emergency._id}`, { method: 'DELETE' })

            data = await response.json()
        } catch (err) {
            deleteRef.current = true
            setError("Erreur : Problème de connexion")
            setModalVisible(false)
            setTimeout(() => {
                setError("")
            }, 3000)
            return
        }


        if (data.result) {
            setError("Requête supprimée !")
            setModalVisible(false)
            setTimeout(() => {
                setError("")
                deleteRef.current = true
                dispatch(suppressAnEmergency(emergency._id))
                router.back('/emergencies-list')
            }, 1000)
        } else {
            setError("Problème d'enregistrement de votre demande. Quittez l'appli et reconnectez vous.")
            setModalVisible(false)
            setTimeout(() => {
                setError("")
                deleteRef.current = true
            }, 2500)
        }
    }




    // Affichage d'un éventuel média

    let media

    // Image
    if (emergency.media_type === 'image') {
        media = <>
            <View style={[styles.underlineContainer, { marginBottom: RPW(3) }]}>
                <Text style={styles.informationTitle}>Média :</Text>
            </View>
            <View style={styles.mediaContainer}>
                <Image source={{ uri: emergency.media_url }} style={styles.image}></Image>
            </View>
        </>
    }

    // Vidéo
    const [videoWasLaunched, setVideoWasLaunched] = useState(false)
    const [playerStatus, setPlayerStatus] = useState(false)
    const player = useVideoPlayer(emergency.media_url);

    useEventListener(player, 'statusChange', ({ status }) => {
        setPlayerStatus(status);
    });


    if (emergency.media_type === 'video' && emergency.media_url) {
        media = <>
            <View style={[styles.underlineContainer, { marginBottom: RPW(3) }]}>
                <Text style={styles.informationTitle}>Média :</Text>
            </View>
            <View style={styles.mediaContainer}>
                <Text style={[{ color: "red", fontSize: RPW(4.7), fontWeight: "600" }, playerStatus === "readyToPlay" && { display: "none" }]}>Chargement de la vidéo...</Text>
                <VideoView style={styles.video} player={player} />
                {Platform.OS === "ios" && <FontAwesome5 name="play" size={RPW(16)} style={[styles.playIcon, videoWasLaunched && { display: 'none' }]} onPress={() => {
                    player.play()
                    setVideoWasLaunched(true)
                }} />}
            </View>
        </>
    }




    // Composant pour rafraichir la page

    const [isRefreshing, setIsRefreshing] = useState(false)

    const refreshComponent = <RefreshControl refreshing={isRefreshing} colors={["#0c0000"]} progressBackgroundColor={"#fffcfc"} tintColor={"#0c0000"} onRefresh={() => {
        setIsRefreshing(true)
        setTimeout(() => setIsRefreshing(false), 1000)
        getEmergencies()
    }} />






    // MAP
    let map = ""
    let locationContainer = ""

    if (emergency?.user_location?.length > 0) {

        const lastLocationDate = moment(emergency.last_location_date).format('DD/MM/YY')
        const lastLocationHour = moment(emergency.last_location_date).format('HH:mm')

        const coords = emergency.user_location
        const latitude = coords[0]
        const longitude = coords[1]
        const title = `${emergency.user_firstname} ${emergency.user_name}`

        const marker = { coordinates: { latitude, longitude }, title, tintColor: "red" }


        if (Platform.OS === 'ios') {
            map = <AppleMaps.View style={styles.map} cameraPosition={{ coordinates: { latitude, longitude }, zoom: 15.5 }} markers={[marker]} uiSettings={{ myLocationButtonEnabled: false }} />;
        } else if (Platform.OS === 'android') {
            map = <GoogleMaps.View style={styles.map} cameraPosition={{ coordinates: { latitude, longitude }, zoom: 15.5 }} markers={[marker]} uiSettings={{ myLocationButtonEnabled: false }} />;
        }

        locationContainer =
            <View style={{ width: RPW(92), alignItems : "flex-start" }}>
                <View style={[styles.underlineContainer, {marginBottom : RPW(4)}]}>
                    <Text style={[styles.informationTitle, {letterSpacing : -RPW(0.2)}]}>
                        Dernière position connue ({lastLocationDate}  {lastLocationHour}) :</Text>
                </View>

                {map}

                <View style={styles.centerContainer}>
                    <TouchableOpacity style={styles.btn} onPress={() => showLocation({
                        latitude,
                        longitude,
                        alwaysIncludeGoogle: true,
                    })}>
                        <Text style={styles.btnText}>Afficher sur Maps</Text>
                    </TouchableOpacity>
                </View>

            </View>
    }




    return (
        <View style={styles.body}>

            <View style={styles.header} >
                <TouchableOpacity style={styles.headerSection} onPress={() => router.back(`/emergencies-list`)}>
                    <FontAwesome5 name="chevron-left" color="white" size={RPW(4.2)} style={styles.icon} />
                    <Text style={styles.headerText}>Liste des demandes</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.body} contentContainerStyle={styles.scrollView} refreshControl={refreshComponent}>

                <Text style={styles.title}>Demande de contact urgent</Text>
                <View style={styles.titleLine}></View>

                <Text style={styles.date}>Demande postée le {date} à {hour}</Text>

                <View style={styles.informationContainer}>
                    <View style={styles.underlineContainer}>
                        <Text style={styles.informationTitle}>
                            Solliciteur :</Text>
                    </View>
                    <Text style={styles.txtInfo} selectable={true}>
                        {emergency.user_firstname} {emergency.user_name}
                    </Text>
                </View>

                <View style={styles.informationContainer}>
                    <View style={styles.underlineContainer}>
                        <Text style={styles.informationTitle}>
                            Téléphone :</Text>
                    </View>
                    <Text style={[styles.txtInfo, { letterSpacing: RPW(0.4) }]} selectable={true}>{emergency.user_phone}</Text>
                </View>

                {emergency.user_email &&
                    <View style={styles.informationContainer}>
                        <View style={styles.underlineContainer}>
                            <Text style={styles.informationTitle}>
                                Email :</Text>
                        </View>
                        <Text style={styles.txtInfo} selectable={true}>{emergency.user_email}</Text>
                    </View>
                }

                <View style={styles.reasonContainer}>
                    <View style={styles.underlineContainer}>
                        <Text style={styles.informationTitle}>
                            Motif :</Text>
                    </View>
                    <Text style={styles.txtInfo} selectable={true}>{emergency.emergency_reason}</Text>
                </View>

                {media}

                {emergency.media_url &&
                    <View style={styles.centerContainer}>
                        <Link href={emergency.media_url}>
                            <View style={styles.btn}>
                                <Text style={styles.btnText}>Télécharger le média</Text>
                            </View>
                        </Link>
                    </View>
                }

                {locationContainer}


                <Text style={[styles.error, !error && { display: "none" }, error == "Requête supprimée !" && { color: "green" }]}>{error}</Text>


                <View style={styles.centerContainer}>
                    <TouchableOpacity style={styles.btn} onPress={() => setModalVisible(true)}>
                        <Text style={styles.btnText}>Supprimer la demande</Text>
                    </TouchableOpacity>
                </View>



                <Modal
                    isVisible={modalVisible}
                    style={styles.modal}
                    backdropColor="transparent"
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    statusBarTranslucent={true}
                    onBackButtonPress={() => setModalVisible(!modalVisible)}
                    onBackdropPress={() => setModalVisible(!modalVisible)}
                >
                    <View style={styles.modalBody}>
                        <Text style={styles.modalText}>Êtes vous sûr de vouloir supprimer cette requête ?</Text>
                        <View style={styles.line2}>
                        </View>
                        <View style={styles.btnContainer}>
                            <TouchableOpacity style={styles.btn2} onPress={() => setModalVisible(false)}>
                                <Text style={styles.btnText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btn2} onPress={() => deletePress()}>
                                <Text style={styles.btnText}>Supprimer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>





            </ScrollView>
        </View>

    );
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: "#fffcfc",
    },
    header: {
        height: RPW(10),
        width: RPW(100),
        paddingLeft: RPW(4),
        paddingRight: RPW(4),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#0c0000",
    },
    headerSection: {
        width: RPW(65),
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
    scrollView: {
        alignItems: 'flex-start',
        paddingTop: RPW(5),
        paddingBottom: RPW(8),
        paddingRight: RPW(4),
        paddingLeft: RPW(4),
        backgroundColor: "#fffcfc",
    },
    title: {
        color: "#0c0000",
        fontSize: RPW(8),
        marginBottom: RPW(5),
        fontFamily: "Barlow-Bold",
        letterSpacing: RPW(0),
        textAlign: "center"
    },
    titleLine: {
        width: RPW(30),
        height: 3.5,
        marginBottom: RPW(3),
        borderRadius: 15,
        backgroundColor: "rgb(185, 0, 0)",
    },
    date: {
        color: "#0c0000",
        fontSize: RPW(4.5),
        fontFamily: "Barlow-Light",
        letterSpacing: RPW(0.2),
        marginBottom: RPW(10),
    },
    informationContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: RPW(4)
    },
    underlineContainer: {
        borderBottomWidth: 3,
        borderBottomColor: "#0c0000",
        paddingBottom: RPW(1.5),
        marginRight: RPW(4)
    },
    informationTitle: {
        color: "#0c0000",
        fontSize: RPW(6),
        fontFamily: "Barlow-Bold",
        letterSpacing: RPW(0),
    },
    txtInfo: {
        color: "#0c0000",
        fontSize: RPW(6),
        fontFamily: "Barlow-Regular",
        letterSpacing: RPW(0.2),
        paddingBottom: RPW(1.5),
    },
    reasonContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: RPW(9),
    },
    mediaContainer: {
        width: RPW(92),
        height: RPW(50),
        justifyContent: "center",
        marginBottom: RPW(7),
        marginTop: RPW(3),
        alignSelf: "center",
    },
    image: {
        resizeMode: "contain",
        height: RPW(50)
    },
    video: {
        height: RPW(50),
        width: RPW(92),
    },
    playIcon: {
        position: "absolute",
        alignSelf: "center",
        color: "white",
    },
    centerContainer: {
        width: RPW(92),
        alignItems: "center",
        marginBottom: RPW(6)
    },
    btn: {
        backgroundColor: "#0c0000",
        height: RPW(10),
        width: RPW(55),
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    btnText: {
        color: "#fffcfc",
        fontSize: RPW(4.7),
        fontWeight: "500",
    },
    map: {
        alignSelf: "center",
        width: RPW(92),
        height: RPW(70),
        marginBottom: RPW(6)
    },
    error: {
        color: 'red',
        fontSize: RPW(4.8),
        fontWeight: "600",
        alignSelf: "center",
        marginBottom: RPW(3)
    },
    modal: {
        alignItems: "center"
    },
    modalBody: {
        height: RPW(65),
        width: RPW(90),
        borderRadius: 10,
        paddingTop: RPW(8),
        paddingBottom: RPW(8),
        backgroundColor: "#e7e7e7",
        position: "absolute",
        bottom: RPH(11),
        justifyContent: "space-between",
    },
    modalText: {
        color: "#0c0000",
        fontSize: RPW(5),
        fontWeight: "600",
        textAlign: "center",
        paddingLeft: RPW(6),
        paddingRight: RPW(6),
        lineHeight: RPW(9)
    },
    line2: {
        width: "90%",
        height: 4,
        marginTop: 0,
        backgroundColor: "rgb(157, 0, 0)",
        alignSelf: "center",
    },
    btnContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    btn2: {
        backgroundColor: "#0c0000",
        height: RPW(10),
        width: RPW(36),
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },

});