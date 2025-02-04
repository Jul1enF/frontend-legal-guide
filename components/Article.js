import { View, Text, StyleSheet, Dimensions, Image, StatusBar, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { RPH, RPW } from "../modules/dimensions"
import { useState, useEffect } from "react";

import YoutubePlayer from "react-native-youtube-iframe";

import moment from 'moment/min/moment-with-locales'
import requires from '../modules/imageRequires';


export default function Article(props) {

    // Source de l'image à réquérir différement si elle est en ligne ou sur l'appareil

    const onlineImage = props.img_link.includes('https') ? true : false


    let image
    if (onlineImage) {
        image = <Image
            style={[styles.image, {
                width: RPW(41 * props.img_zoom),
                marginTop: RPW(props.img_margin_top * 0.41),
                marginLeft: RPW(props.img_margin_left * 0.41)
            }]}
            source={{ uri: props.img_link, }}
        />
    } else {
        image = <Image
            style={[styles.image, {
                width: RPW(41 * props.img_zoom),
                marginTop: RPW(props.img_margin_top * 0.41),
                marginLeft: RPW(props.img_margin_left * 0.41)
            }]}
            source={requires[props.img_link]}
        />
    }



    moment.locale('fr')
    const lastingTime = moment(props.createdAt).fromNow()

    return (
        <View style={styles.body}>
            <View style={styles.row1}>
                <View style={styles.column1}>
                    <Text style={styles.title}>{props.title}</Text>
                </View>
                <View style={styles.column2}>
                    <View style={[styles.imgContainer, {height : RPW(41 * props.img_ratio)}]} >
                    {image}
                    </View>

                </View>
            </View>

            <View style={styles.row2}>
                <View style={styles.postInfos}>
                    {props.sub_category && <Text numberOfLines={3} style={styles.subTitle}>{props.sub_category}</Text>}
                    <Text style={styles.date}>{lastingTime}</Text>
                </View>
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
        paddingTop: 8,
        marginBottom: 0,
        paddingRight: RPW(3),
        paddingLeft: RPW(3),
    },
    row1: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 13,
    },
    column1: {
        width: RPW(50),
        minHeight: RPW(14.5),
        justifyContent: "center",
    },
    title: {
        color: "#2a0000",
        fontSize: RPW(5.8),
        lineHeight: RPW(5.7),
        fontWeight: "450",
        fontFamily: "Barlow-SemiBold",
        letterSpacing: RPW(-0.05),
    },
    row2: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 13,
    },
    postInfos: {
        flexDirection: "row",
        alignItems: "center"
    },
    subTitle: {
        color: "rgb(185, 0, 0)",
        fontSize: RPW(4.2),
        lineHeight: RPW(4.5),
        fontWeight: "400",
        marginRight: RPW(3.5),
        fontFamily: "Barlow-SemiBold",
        letterSpacing: RPW(0.16),
    },
    date: {
        color: "#2a0000",
        fontSize: RPW(3.6),
        lineHeight: RPW(4.5),
        fontWeight: "300",
        fontFamily: "Barlow-Light",
        letterSpacing: RPW(0.12),
    },
    column2: {
        width: RPW(41),
        height: "auto",
        alignItems: "center",
        justifyContent: 'flex-start',
    },
    imgContainer: {
        width: RPW(41),
        overflow: "hidden",
        justifyContent: "center",
    },
    image: {
        height: RPW(1000),
        resizeMode: "contain",
    },
    gradientLine2: {
        width: RPW(100),
        marginLeft: RPW(-3),
        height: 1,
        borderRadius: 15,
    },
})