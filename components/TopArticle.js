import { View, Text, StyleSheet, Image, Platform, StatusBar } from 'react-native'
import { RPH, RPW } from "../modules/dimensions"
import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from 'expo-router';

import { addBookmark, removeBookmark } from '../reducers/user';

import Icon from "@expo/vector-icons/MaterialCommunityIcons"

import moment from 'moment/min/moment-with-locales'
import requires from '../modules/imageRequires';
import NetInfo from "@react-native-community/netinfo";


export default function TopArticle(props) {

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






    // État pour afficher un carré noir quand l'image n'a pas fini de charger

    const [imgLoaded, setImgLoaded] = useState(false)


    // Source de l'image à réquérir différement si elle est en ligne, sur l'appareil ou dans l'app

    const [imageLoadError, setImageLoadError]=useState(false)
    const backupImage = (!isOnline && imageLoadError) ? true : false

    let image
    if (requires[props.img_link] === undefined) {
        if (!isOnline && imageLoadError) {
            image = <Image
            style={[styles.image, { width: RPW(100) },]}
            source={props.category === "advices" ? require('../assets/backup-advices1.jpg') : require('../assets/backup-press1.jpg')}
            onLoad={() => setImgLoaded(true)}
        />
        } else {
            image = <Image
                style={[styles.image, {
                    width: RPW(100 * props.img_zoom),
                    marginTop: RPW(props.img_margin_top * 1),
                    marginLeft: RPW(props.img_margin_left * 1)
                },]}
                source={{ uri: props.img_link, }}
                onError={({ nativeEvent: {error} }) => setImageLoadError(true)}
                onLoad={() => {
                    setImgLoaded(true)
                    setImageLoadError(false)
                }}
            />
        }
    } else {
        image = <Image
            style={[styles.image, {
                width: RPW(100 * props.img_zoom),
                marginTop: RPW(props.img_margin_top),
                marginLeft: RPW(props.img_margin_left)
            },]}
            source={requires[props.img_link]}
            onLoadEnd={() => setImgLoaded(true)}
        />
    }



    moment.locale('fr')
    const lastingTime = moment(props.createdAt).fromNow()

    return (
        <View style={[styles.body, props.index === 0 && { paddingTop: 0 }]}>

            {props.img_link && <View style={[styles.imgContainer, { height: backupImage ? RPW(100) : RPW(100 * props.img_ratio) }]} >
                {
                    !imgLoaded && <View style={[{ minWidth: RPW(300), minHeight: RPW(600), backgroundColor: "#fffcfc" }]}></View>
                }

                {image}
            </View>}


            <View style={styles.textContainer}>

                <Text style={styles.titles}>
                    {props.sub_category && <Text style={styles.subTitle}>{props.sub_category}  </Text>}
                    <Text style={styles.title}>{props.title}</Text>
                </Text>


                <View style={styles.row}>
                    <Text style={styles.date}>Publié {lastingTime}</Text>

                    {(user.jwtToken && props._id !== "testArticleId") && <Icon name={isBookmarked ? "heart-remove" : "heart-plus"} size={RPW(6)} color={isBookmarked ? "rgb(185, 0, 0)" : "#0c0000"} onPress={() => bookmarkPress()} />}
                </View>

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
        paddingTop: 4,
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
    subTitle: {
        color: "rgb(185, 0, 0)",
        fontSize: RPW(7.3),
        lineHeight: RPW(7.3),
        marginRight: RPW(3),
        fontWeight: "400",
        fontFamily: "Barlow-Bold",
        letterSpacing: RPW(0.1),
    },
    title: {
        color: "#0c0000",
        fontSize: RPW(7.3),
        lineHeight: RPW(7.3),
        fontWeight: "450",
        marginBottom: 15,
        fontFamily: "Barlow-Bold",
        letterSpacing: RPW(-0.05),
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    date: {
        color: "#0c0000",
        fontSize: RPW(3.6),
        lineHeight: RPW(4.5),
        marginLeft: RPW(0),
        marginBottom: 0,
        fontWeight: "300",
        fontFamily: "Barlow-Light",
        letterSpacing: RPW(0.12),
    },
    line2: {
        backgroundColor: "rgb(185, 0, 0)",
        width: "100%",
        height: 1,
        borderRadius: 15,
    },
})