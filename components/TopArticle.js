import { View, Text, StyleSheet, Image, Platform, StatusBar } from 'react-native'
import { RPH, RPW } from "../modules/dimensions"
import { useState, useEffect } from 'react';

import YoutubePlayer from "react-native-youtube-iframe";

import moment from 'moment/min/moment-with-locales'
import requires from '../modules/imageRequires';


export default function TopArticle(props) {

    // État pour afficher un carré noir quand l'image n'a pas fini de charger

    const [imgLoaded, setImgLoaded] = useState(false)


    // Source de l'image à réquérir différement si elle est en ligne ou sur l'appareil

    const onlineImage = props.img_link.includes('https')

    let image
    if (onlineImage) {
        image = <Image
            style={[styles.image, {
                width: RPW(100 * props.img_zoom),
                marginTop: RPW(props.img_margin_top * 1),
                marginLeft: RPW(props.img_margin_left * 1)
            },]}
            source={{ uri: props.img_link, }}
            onLoadEnd={() => setImgLoaded(true)}
        />
    }else {
        image =     <Image
        style={[styles.image, {
            width: RPW(100 * props.img_zoom),
            marginTop: RPW(props.img_margin_top),
            marginLeft: RPW(props.img_margin_left)
        },]}
        source={requires[props.img_link]}
        onLoadEnd={() => setImgLoaded(true)}
    />
    }

    // {
    //     !imgLoaded && <View style={[{ minWidth: RPW(300), minHeight: RPW(600), backgroundColor: "#f9fff4" }]}></View>
    // }

    moment.locale('fr')
    const lastingTime = moment(props.createdAt).fromNow()

    return (
        <View style={[styles.body, props.index === 0 && {paddingTop : 0}]}>

            {props.img_link && <View style={[styles.imgContainer, { height: RPW(100*props.img_ratio)}]} >

         
                {image}
            </View>}


            <View style={styles.textContainer}>

                <Text style={styles.titles}>
                    <Text style={styles.subTitle}>{props.sub_category}  </Text>
                    <Text style={styles.title}>{props.title}</Text>
                </Text>



                <Text style={styles.date}>Publié {lastingTime}</Text>
            </View>


            <View style={styles.line2}>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        width: RPW(100),
        marginBottom: 0,
        paddingTop : 4,
    },
    imgContainer: {
        width: RPW(100),
        overflow: "hidden",
        justifyContent: "center"
    },
    image: {
        resizeMode: "contain",
        height: RPW(1000),
    },
    textContainer: {
        paddingLeft: RPW(3),
        paddingTop: RPW(3),
        paddingRight: RPW(3),
        overflow: "hidden",
        marginBottom: 12,
    },
    titles: {
        marginBottom: 10,
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
    gradientLine: {
        width: "90%",
        height: 5,
        marginBottom: 15,
        borderRadius: 15,
    },
    subTitle: {
        color: "rgb(185, 0, 0)",
        fontSize: RPW(7.3),
        lineHeight: RPW(7.3),
        marginRight: RPW(3),
        fontWeight: "400",
        fontFamily: "Barlow-Bold",
        letterSpacing: RPW(0.1),
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
    line2: {
        backgroundColor : "rgb(185, 0, 0)",
        width: "100%",
        height: 1,
        borderRadius: 15,
    },
})