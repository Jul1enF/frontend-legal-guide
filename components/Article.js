import { View, Text, StyleSheet, Dimensions, Image, StatusBar, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { RPH, RPW } from "../modules/dimensions"
import { useState, useEffect } from "react";

import YoutubePlayer from "react-native-youtube-iframe";

import moment from 'moment/min/moment-with-locales'


export default function Article(props) {



    moment.locale('fr')
    const lastingTime = moment(props.createdAt).fromNow()

    return (
        <View style={styles.body}>
            <View style={styles.row1}>
                <View style={styles.column1}>
                    <Text numberOfLines={5} style={styles.title}>{props.title}</Text>
                </View>
                <View style={styles.column2}>
                    <View style={styles.imgContainer} >
                        <Image
                            style={[styles.image, {
                                width: RPW(41 * props.img_zoom),
                                marginTop: RPW(props.img_margin_top * 0.41),
                                marginLeft: RPW(props.img_margin_left * 0.41)
                            }]}
                            source={{ uri: props.img_link, }}
                        />
                    </View>

                </View>
            </View>

            <View style={styles.row2}>
                <View style={styles.postInfos}>
                    {props.sub_title && <Text numberOfLines={3} style={styles.subTitle}>{props.sub_title}</Text>}
                    <Text style={styles.date}>{lastingTime}</Text>
                </View>
            </View>


            <LinearGradient
                colors={['#cb0000', '#230000']}
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
        paddingTop: 4,
        marginBottom: 10,
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
        minHeight: RPW(24.5),
        justifyContent: "center",
    },
    title: {
        color: "#2a0000",
        fontSize: RPW(5.2),
        lineHeight : RPW(5.7),
        fontWeight: "450",
        fontFamily: "Barlow-SemiBold",
        letterSpacing: RPW(-0.05),
    },
    row2: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 13,
    },
    postInfos : {
        flexDirection : "row",
        alignItems : "center"
    },
    subTitle: {
        color: "#2a0000",
        fontSize: RPW(3.4),
        fontWeight: "400",
        marginRight : RPW(3.5),
        fontFamily : "Barlow-Regular",
        letterSpacing : RPW(0.1),
    },
    date: {
        color: "#2a0000",
        fontSize: RPW(3.4),
        fontWeight: "300",
        fontFamily : "Barlow-Light",
        letterSpacing : RPW(0.12),
    },
    column2: {
        width: RPW(41),
        height: "auto",
        alignItems: "center",
        justifyContent: 'flex-start',
    },
    imgContainer: {
        width: RPW(41),
        height: RPW(24.5),
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