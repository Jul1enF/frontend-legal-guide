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
            <View style={styles.row}>
                <View style={styles.column1}>
                    <Text numberOfLines={4} style={styles.title}>{props.title}</Text>
                    {props.sub_title && <Text numberOfLines={3} style={styles.subTitle}>{props.sub_title}</Text>}
                    <Text style={styles.date}>Posté {lastingTime}</Text>
                </View>
                <View style={styles.column2}>
                    {props.img_link && <View style={styles.imgContainer} >
                        <Image
                            style={[styles.image, {
                                width: RPW(41 * props.img_zoom),
                                marginTop: RPW(props.img_margin_top * 0.41),
                                marginLeft: RPW(props.img_margin_left * 0.41)
                            }]}
                            source={{ uri: props.img_link, }}
                        />
                    </View>}

                    {!props.img_link &&
                        <View style={{ width: RPW(41), height: RPH(12.5) }} pointerEvents="none" overflow="hidden" justifyContent="center" >
                            <YoutubePlayer
                                width={RPW(41)}
                                height={RPW(24)}
                                videoId={props.video_id}
                                initialPlayerParams={{ modestbranding: false }}
                            />
                        </View>
                    }

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
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 14,
    },
    column1: {
        width: RPW(51),
        maxHeight: RPH(17),
        minHeight: RPH(12.5),
        justifyContent: "space-evenly",
    },
    title: {
        color: "#2a0000",
        fontSize: RPW(5.2),
        fontWeight: "450",
        marginBottom: 10
    },
    subTitle: {
        color: "#2a0000",
        fontSize: RPW(3.6),
        fontWeight: "400",
        marginBottom: 10,
    },
    date: {
        color: "#2a0000",
        fontSize: RPW(3.2),
        fontWeight: "300"
    },
    column2: {
        width: RPW(41),
        height: "auto",
        alignItems: "center",
        justifyContent: 'center',
    },
    imgContainer: {
        width: RPW(41),
        height: RPW(22.5),
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