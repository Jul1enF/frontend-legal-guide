import { View, Text, StyleSheet, Image, Platform, StatusBar } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { RPH, RPW } from "../modules/dimensions"
import { useState, useEffect } from 'react';

import YoutubePlayer from "react-native-youtube-iframe";

import moment from 'moment/min/moment-with-locales'


export default function TopArticle(props) {

    // État pour afficher un carré noir quand l'image n'a pas fini de charger

    const [imgLoaded, setImgLoaded] = useState(false)




    // Si pas de sous catégorie / Sous titre, affichage du début du texte
    let optionnalSubTitle = ""
    if (!props.sub_title && props.text) {
        optionnalSubTitle = <Text numberOfLines={3} style={styles.subTitle}>{props.text}</Text>
    }

    moment.locale('fr')
    const lastingTime = moment(props.createdAt).fromNow()

    return (
        <View style={styles.body}>

            {props.img_link && <View style={styles.imgContainer} >

                {
                    !imgLoaded && <View style={[{ minWidth: RPW(300), minHeight: RPW(600), backgroundColor: "#f9fff4" }]}></View>
                }

                <Image
                    style={[styles.image, {
                        width: RPW(100 * props.img_zoom),
                        marginTop: RPW(props.img_margin_top),
                        marginLeft: RPW(props.img_margin_left)
                    },]}
                    source={{ uri: props.img_link, }}
                    // onLoadStart={() => setImgLoaded(false)}
                    onLoadEnd={() => setImgLoaded(true)}
                />
            </View>}


            <View style={styles.textContainer}>

                <Text style={styles.subTitle}>{props.sub_title}</Text>
                <LinearGradient
                    colors={["rgb(185, 0, 0)", "rgb(185, 0, 0)"]}
                    locations={[0.15, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientLine}
                >
                </LinearGradient>

                <Text style={styles.title}>{props.title}</Text>


                <Text style={styles.date}>Publié {lastingTime}</Text>
            </View>


            <LinearGradient
                colors={["rgb(185, 0, 0)", "rgb(185, 0, 0)"]}
                locations={[0.15, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.gradientLine2}
            >
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        width: RPW(100),
        marginBottom: 14,
    },
    imgContainer: {
        width: RPW(100),
        height: RPW(55),
        overflow: "hidden",
        justifyContent: "center"
    },
    image: {
        height: RPW(1000),
        resizeMode: "contain",
    },
    textContainer: {
        paddingLeft: RPW(3),
        paddingTop: RPW(3),
        paddingRight: RPW(3),
        overflow: "hidden",
        marginBottom: 12,
    },
    subTitle: {
        color: "rgb(185, 0, 0)",
        width: "auto",
        fontSize: RPW(7.3),
        lineHeight: RPW(7.3),
        fontWeight: "400",
        fontFamily: "Barlow-Bold",
        letterSpacing: RPW(0.1),
        marginBottom : 11,
    },
    gradientLine: {
        width: "30%",
        height: 3.5,
        marginBottom: 10,
        marginLeft: RPW(0),
        borderRadius: 15,
    },
    title: {
        color: "#2a0000",
        fontSize: RPW(7.3),
        lineHeight: RPW(7.3),
        fontWeight: "450",
        marginBottom: 15,
        fontFamily: "Barlow-Bold",
        letterSpacing: RPW(-0.05),
    },
    date: {
        color: "#2a0000",
        fontSize: RPW(3.6),
        lineHeight: RPW(4.5),
        marginLeft: RPW(0),
        marginBottom: 0,
        fontWeight: "300",
        fontFamily: "Barlow-Light",
        letterSpacing: RPW(0.12),
    },
    gradientLine2: {
        width: "100%",
        height: 1,
        borderRadius: 15,
    },
})