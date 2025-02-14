
import { router, useLocalSearchParams, Link } from 'expo-router'
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import moment from 'moment/min/moment-with-locales'
import { useVideoPlayer, VideoView } from 'expo-video';

import { RPH, RPW } from '../../../../../modules/dimensions'

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function EmergencyDetail() {

    const { _id } = useLocalSearchParams()

    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS
    const user = useSelector((state) => state.user.value)
    const emergencies = useSelector((state) => state.emergencies.value)
    const dispatch = useDispatch()

    const [error, setError] = useState('')

    const [emergency, setEmergency] = useState("")


    // UseEffect pour charger la demande de contact urgent
    useEffect(() => {
        emergencies.emergenciesList.map(e => {
            if (e._id === _id) {
                setEmergency(e)
            }
        })
    }, [emergencies])


    moment.locale('fr')
    const date = moment(emergency.createdAt).format('DD/MM/YYYY')
    const hour = moment(emergency.createdAt).format('LT')





    // Affichage d'un éventuel média

    let media

    // Image
    if (emergency.media_type === 'image') {
        media = <>
             <View style={[styles.underlineContainer, {marginBottom : RPW(3)}]}>
                <Text style={styles.informationTitle}>Média :</Text>
            </View>
            <View style={styles.imgContainer}>
                <Image source={{ uri: emergency.media_url }} style={styles.image}></Image>
            </View>
        </>
    }

    // Vidéo
    const [videoWasLaunched, setVideoWasLaunched] = useState(false)
    const player = useVideoPlayer(emergency.media_url);


    if (emergency.media_type === 'video' && emergency.media_url) {
        media = <>
            <View style={[styles.underlineContainer, {marginBottom : RPW(3)}]}>
                <Text style={styles.informationTitle}>Média :</Text>
            </View>
            <View style={styles.videoContainer}>
                <VideoView style={styles.video} player={player} allowsPictureInPicture />
                {Platform.OS === "ios" && <FontAwesome5 name="play" size={RPW(16)} style={[styles.playIcon, videoWasLaunched && { display: 'none' }]} onPress={() => {
                    player.play()
                    setVideoWasLaunched(true)
                }} />}
            </View>
        </>
    }







    return (
        <View style={styles.body}>

            <View style={styles.header} >
                <TouchableOpacity style={styles.headerSection} onPress={() => router.back(`/emergencies-list`)}>
                    <FontAwesome5 name="chevron-left" color="white" size={RPW(4.2)} style={styles.icon} />
                    <Text style={styles.headerText}>Liste des demandes</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.body} contentContainerStyle={styles.scrollView}>

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

                {emergency.media_url && <Link href={emergency.media_url} style={styles.btn}>
                <Text style={styles.btnText}>Télécharger le média</Text>
                </Link>}

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
        paddingRight: RPW(3),
        paddingLeft: RPW(4)
    },
    title: {
        color: "#2a0000",
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
        color: "#2a0000",
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
        borderBottomColor: "#2a0000",
        paddingBottom: RPW(1.5),
        marginRight: RPW(4)
    },
    informationTitle: {
        color: "#2a0000",
        fontSize: RPW(6),
        fontFamily: "Barlow-Bold",
        letterSpacing: RPW(0),
    },
    txtInfo: {
        color: "#2a0000",
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
    imgContainer: {
        width: RPW(90),
        height: RPW(50),
        justifyContent: "center",
        marginBottom: RPW(5),
        alignSelf: "center",
    },
    image: {
        resizeMode: "contain",
        height: RPW(50)
    },
    videoContainer: {
        marginBottom: RPW(5),
        height: RPW(50),
        width: RPW(90),
        alignItems: "center",
        justifyContent: "center",
    },
    video: {
        height: RPW(50),
        width: RPW(90),
    },
    playIcon: {
        position: "absolute",
        color: "white",
    },
    btn : {
        backgroundColor : "#2a0000",
    },
    btnText : {
        color : "#0c0000",
    }
});