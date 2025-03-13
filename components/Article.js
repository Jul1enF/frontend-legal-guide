import { View, Text, StyleSheet, Dimensions, Image, StatusBar, Platform } from "react-native";
import { RPH, RPW } from "../modules/dimensions"

import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from 'expo-router';

import { addBookmark, removeBookmark } from '../reducers/user';

import Icon from "@expo/vector-icons/MaterialCommunityIcons"

import NetInfo from "@react-native-community/netinfo";

import moment from 'moment/min/moment-with-locales'
import requires from '../modules/imageRequires';


export default function Article(props) {


    const user = useSelector((state) => state.user.value)
    const dispatch = useDispatch()
    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS

    const [isBookmarked, setIsBookmarked] = useState(false)




    // useFocusEffect pour vérifier si l'article est en favoris

    useFocusEffect(useCallback(() => {
        // Si utilisateur pas connecté
        if (!user.jwtToken) { return }

        user.bookmarks.includes(props._id) ? setIsBookmarked(true) : setIsBookmarked(false)
    }, [user]))





    // Fonction, État et useFocusEffect pour déterminer si l'utilisateur est connecté à internet (pour affichage de l'image)

    const [isOnline, setIsOnline] = useState(true)

    const checkNetConnection = async () => {
        const state = await NetInfo.fetch()
        state.isConnected ? setIsOnline(true) : setIsOnline(false)
    }

    useFocusEffect(useCallback(() => {
        checkNetConnection()
    }, [imageLoadError]))






    // Fonction appelée en cliquant sur l'icone favoris
    const bookmarkPress = async () => {
        if (props._id === "testArticleId" || props.test) {
            return
        }
        if (!isBookmarked) {
            const response = await fetch(`${url}/userModifications/addBookmark`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jwtToken: user.jwtToken,
                    _id: props._id,
                })
            })
            const data = await response.json()

            if (!data.result) {
                return
            }
            else {
                setIsBookmarked(true)
                dispatch(addBookmark(props._id))
            }
        }
        else {
            const response = await fetch(`${url}/userModifications/removeBookmark`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jwtToken: user.jwtToken,
                    _id: props._id,
                })
            })
            const data = await response.json()

            if (!data.result) {
                return
            }
            else {
                setIsBookmarked(false)
                dispatch(removeBookmark(props._id))
            }
        }
    }





    // Source de l'image à réquérir différement si elle est en ligne, sur l'appareil ou si le portable est offline

    const [imageLoadError, setImageLoadError]=useState(false)
    const backupImage = (!isOnline && imageLoadError) ? true : false

    let image
    if (requires[props.img_link] === undefined) {
        if (!isOnline && imageLoadError){
            image = <Image
            style={[styles.image, { width: RPW(41)}]}
            source={props.category === "advices" ? require('../assets/backup-advices2.jpg') : require('../assets/backup-press2.jpg')}
        />
        }
        else {
            image = <Image
                style={[styles.image, {
                    width: RPW(41 * props.img_zoom),
                    marginTop: RPW(props.img_margin_top * 0.41),
                    marginLeft: RPW(props.img_margin_left * 0.41)
                }]}
                source={{ uri: props.img_link, }}
                onError={({ nativeEvent: {error} }) => {setImageLoadError(true)}}
                onLoad={() => {setImageLoadError(false)}}
            />
        }
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



    // Lineheight différent en fonction de la taille du titre

    let titleLineHeight = RPW(10)

    if (props.title.length >= 65 && props.title.length <= 91) {
        titleLineHeight = RPW(8.2)
    } else if (props.title.length > 91) {
        titleLineHeight = RPW(6.5)
    }



    moment.locale('fr')
    const lastingTime = moment(props.createdAt).fromNow()

    return (
        <View style={styles.body}>
            <View style={styles.row1}>
                <View style={styles.column1}>
                    <Text style={[styles.title, { lineHeight: titleLineHeight }]}>{props.title}</Text>
                </View>
                <View style={styles.column2}>
                    <View style={[styles.imgContainer, { height: !backupImage ? RPW(41 * props.img_ratio) : RPW(41)}]} >
                        {image}
                    </View>

                </View>
            </View>

            <View style={styles.row2}>

                <View style={styles.postInfos}>
                    {props.sub_category && <Text numberOfLines={3} style={styles.subTitle}>{props.sub_category}</Text>}
                    <Text style={styles.date}>{lastingTime}</Text>
                </View>

                {(user.jwtToken && props._id !== "testArticleId") && <Icon name={isBookmarked ? "heart-remove" : "heart-plus"} size={RPW(6)} color={isBookmarked ? "rgb(185, 0, 0)" : "#0c0000"} onPress={() => bookmarkPress()} />}
            </View>

            {/* <Text>IS ONLINE : {isOnline.toString()}</Text>
            <Text>IMAGE LOAD ERROR : {imageLoadError.toString()}</Text> */}
            <View style={styles.line} >
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        width: RPW(100),
        paddingTop: 11,
        marginBottom: 0,
        paddingRight: RPW(2),
        paddingLeft: RPW(2),
    },
    row1: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 13,
    },
    column1: {
        width: RPW(54),
        minHeight: RPW(14.5),
        justifyContent: "center",
    },
    title: {
        color: "#0c0000",
        fontSize: RPW(6),
        lineHeight: RPW(8.2),
        fontWeight: "450",
        fontFamily: "Barlow-Bold",
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
        color: "#0c0000",
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
    line: {
        backgroundColor: "rgb(185, 0, 0)",
        width: RPW(100),
        marginLeft: RPW(-3),
        height: 1,
        borderRadius: 15,
    },
})