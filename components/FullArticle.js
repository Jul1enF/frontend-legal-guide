import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar } from "react-native";
import { useEffect, useState, useCallback } from 'react'
import { useFocusEffect } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { addBookmark, removeBookmark } from "../reducers/user";
import { addTestArticle } from "../reducers/testArticle";
import { deleteOneArticle } from "../reducers/articles"
import { RPH, RPW } from "../modules/dimensions"

import { router, Link } from "expo-router";

import Modal from "react-native-modal"
import Icon from "@expo/vector-icons/MaterialCommunityIcons"
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import YoutubePlayer from "react-native-youtube-iframe";
import moment from 'moment/min/moment-with-locales'

import requires from "../modules/imageRequires";


export default function FullArticle(props) {

    const { category } = props
    const { _id } = props

    const dispatch = useDispatch()
    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS

    const testArticle = useSelector((state) => state.testArticle.value)
    const articles = useSelector((state) => state.articles.value)
    const user = useSelector((state) => state.user.value)

    const [article, setArticle] = useState('')
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)

    const [error, setError] = useState('')



    // useEffect pour charger les infos de l'article
    useEffect(() => {
        if (_id === "testArticleId") {
            setArticle(testArticle[0])
        } else {
            articles.map(e => {
                e._id === _id && setArticle(e)
            })
        }

    }, [user])




    // useFocusEffect pour vérifier si l'article est en favoris, naviguer vers la liste d'articles si l'article test a été supprimé ou si un nouveau a été mis en test

    useFocusEffect(useCallback(() => {
        // Si utilisateur pas connecté
        if (!user.jwtToken) { return }
        user.bookmarks.includes(_id) ? setIsBookmarked(true) : setIsBookmarked(false)

        if (_id === "testArticleId" && testArticle.length === 0) { router.back(`/${category}`) }

        if (testArticle.length > 0 && testArticle[0].category === category && _id !== "testArticleId") { router.back(`/${category}`) }
    }, [user, testArticle]))




    // Fonction appelée en cliquant sur l'icone favoris
    const bookmarkPress = async () => {
        if (_id === "testArticleId") {
            return
        }
        if (!isBookmarked) {
            const response = await fetch(`${url}/userModifications/addBookmark`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jwtToken: user.jwtToken,
                    _id,
                })
            })
            const data = await response.json()

            if (!data.result) {
                setError(data.error)
                setTimeout(() => setError(''), 4000)
            }
            else {
                setIsBookmarked(true)
                dispatch(addBookmark(_id))
            }
        }
        else {
            const response = await fetch(`${url}/userModifications/removeBookmark`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jwtToken: user.jwtToken,
                    _id,
                })
            })
            const data = await response.json()

            if (!data.result) {
                setError(data.error)
                setTimeout(() => setError(''), 4000)
            }
            else {
                setIsBookmarked(false)
                dispatch(removeBookmark(_id))
            }
        }
    }


    // Fonction appelée en cliquant sur modifier

    const modifyPress = () => {

        dispatch(addTestArticle({
            title: article.title,
            sub_category: article.sub_category,
            text1: article.text1,
            text2: article.text2,
            video_id: article.video_id,
            category: article.category,
            img_link: article.img_link,
            img_margin_top: article.img_margin_top,
            img_margin_left: article.img_margin_left,
            img_zoom: article.img_zoom,
            img_ratio: article.img_ratio,
            createdAt: article.createdAt,
            _id: article._id,
            author: article.author,
            tags: article.tags,
            media_link: article.media_link,
            // test : true => Un article déjà posté n'a pas un _id "testArticleId" mais peut être mis en test. C'est donc cet indicateur qui sert à savoir ensuite si l'on affiche la page détaillée d'un article en test ou en BDD
            test: true,
        }))

        router.push('/redaction')
    }



    // Fonction appelée en cliquant sur Supprimer

    const deletePress = async () => {
        const response = await fetch(`${url}/articles/delete-article/${user.jwtToken}/${article._id}`, { method: 'DELETE' })

        const data = await response.json()

        if (!data.result && data.error) {
            setError(data.error)
            setTimeout(() => setError(''), 4000)
        }
        else if (!data.result) {
            setError("Problème de connexion à la base de donnée, merci de contacter le webmaster.")
            setTimeout(() => setError(''), 4000)
        }
        else {
            dispatch(deleteOneArticle(article._id))
            setModalVisible(false)
            router.push(`/${article.category}`)
        }
    }


    // Boutons pour modifications si l'utilsateur est admin

    let modifications
    // user.is_admin &&
    if (_id !== "testArticleId") {
        modifications = (
            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.btn} onPress={() => modifyPress()}>
                    <Text style={styles.btnText}>Modifier</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => setModalVisible(true)}>
                    <Text style={styles.btnText}>Supprimer</Text>
                </TouchableOpacity>
            </View>
        )
    }

    moment.locale('fr')
    const date = moment(article.createdAt).format('LL')
    const hour = moment(article.createdAt).format('LT')


    if (!article) { return <View></View> }




    // Source de l'image à réquérir différement si elle est en ligne ou sur l'appareil

    const onlineImage = article.img_link.includes('https')

    let image
    if (onlineImage) {
        image = <Image
            style={[styles.image, {
                width: RPW(100 * article.img_zoom),
                marginTop: RPW(article.img_margin_top * 1),
                marginLeft: RPW(article.img_margin_left * 1)
            }]}
            source={{ uri: article.img_link }}
        />
    } else {
        image = <Image
            style={[styles.image, {
                width: RPW(100 * article.img_zoom),
                marginTop: RPW(article.img_margin_top * 1),
                marginLeft: RPW(article.img_margin_left * 1)
            }]}
            source={requires[article.img_link]}
        />
    }



    return (
        <View style={styles.body}>
            <StatusBar translucent={true} barStyle="light" />
            <View style={styles.header} >
                <TouchableOpacity style={styles.headerSection} onPress={() => router.back(`/${category}`)}>
                    <FontAwesome5 name="chevron-left" color="white" size={RPW(4.2)} style={styles.icon} />
                    <Text style={styles.headerText}>{props.categoryName}</Text>
                </TouchableOpacity>
                {user.jwtToken && <TouchableOpacity style={styles.headerSection2} onPress={() => bookmarkPress()}>
                    <Text style={styles.headerText} >{isBookmarked ? "Retirer des favoris" : "Ajouter aux favoris"}</Text>
                    <Icon name={isBookmarked ? "heart-remove" : "heart-plus"} size={RPH(2.9)} color={isBookmarked ? "#ff00e8" : "white"} style={styles.icon2} />
                </TouchableOpacity>}
            </View>

            <Text style={[{ color: 'red' }, !error && { display: "none" }]}>{error}</Text>

            <ScrollView style={styles.body} contentContainerStyle={styles.contentBody}>
                <Text style={styles.categoryTitle}>{props.categoryNameSingular}</Text>


                <Text style={styles.subTitle}>{article.sub_category} </Text>
                <Text style={styles.title}>{article.title}</Text>


                <View style={styles.line} >
                </View>
                <Text style={styles.date}>Publié le {date} à {hour}</Text>

                {article.img_link &&
                    <View style={[styles.imgContainer, !article.author && { marginBottom: 25 }, { height: RPW(100 * article.img_ratio) }]} >
                        {image}
                    </View>}


                {article.author && <Text style={[styles.date, { marginBottom: RPW(7) }]}>par {article.author}</Text>}

                {article.text1 && <Text style={styles.text1}>{article.text1}</Text>}

                {article.text2 && <Text style={styles.text2}>{article.text2}</Text>}

                {article.media_link && <Link style={styles.link} href={article.media_link}>{article.media_link}</Link>}

                {article.video_id &&
                    <View style={[styles.youtubeContainer, !article.author && { marginBottom: 25 }]}>
                        <YoutubePlayer
                            height={RPW(56)}
                            width={RPW(98)}
                            videoId={article.video_id}
                            initialPlayerParams={{ modestbranding: false }}
                        />
                    </View>
                }

                <Text style={[{ color: 'red' }, !error && { display: "none" }]}>{error}</Text>

                {modifications}
            </ScrollView>

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
                    <Text style={styles.modalText}>Êtes vous sûr de vouloir supprimer cet article ?</Text>
                    <View style={styles.line2}>
                    </View>
                    <View style={styles.btnContainer}>
                        <TouchableOpacity style={styles.btn} onPress={() => setModalVisible(false)}>
                            <Text style={styles.btnText}>Annuler</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn} onPress={() => deletePress()}>
                            <Text style={styles.btnText}>Supprimer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    )
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
        width: RPW(30),
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    icon: {
        marginRight: RPW(3)
    },
    headerSection2: {
        width: RPW(55),
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    icon2: {
        marginLeft: RPW(3)
    },
    headerText: {
        color: "white",
        fontWeight: "500",
        fontSize: RPW(4.5)
    },
    contentBody: {
        paddingTop: RPH(2),
        paddingLeft: RPW(1),
        paddingRight: RPW(1),
        paddingBottom: 10,
    },
    categoryTitle: {
        color: "#2a0000",
        fontSize: RPW(5.5),
        lineHeight: RPW(5.5),
        fontWeight: "450",
        marginBottom: 20,
        fontFamily: "Barlow-Medium",
        letterSpacing: RPW(-0.0),
    },
    subTitle: {
        color: "rgb(185, 0, 0)",
        fontSize: RPW(7.3),
        lineHeight: RPW(7.5),
        marginRight: RPW(3),
        fontWeight: "400",
        fontFamily: "Barlow-Bold",
        letterSpacing: RPW(0.1),
        marginBottom: 8,
    },
    title: {
        color: "#2a0000",
        fontSize: RPW(7.3),
        lineHeight: RPW(7.5),
        fontWeight: "450",
        marginBottom: 15,
        fontFamily: "Barlow-Bold",
        letterSpacing: RPW(-0.05),
    },
    line: {
        width: "30%",
        height: 3.5,
        marginBottom: 15,
        marginLeft: RPW(1),
        borderRadius: 15,
        backgroundColor: "rgb(185, 0, 0)",
    },
    date: {
        color: "#2a0000",
        fontSize: RPW(3.2),
        fontWeight: "450",
        marginBottom: 12,
        fontFamily: "Barlow-Regular",
        letterSpacing: RPW(0.15),
    },
    imgContainer: {
        width: RPW(100),
        overflow: "hidden",
        justifyContent: "center",
        marginBottom: 12,
        marginLeft: RPW(-1)
    },
    image: {
        height: RPW(1000),
        resizeMode: "contain",
    },
    youtubeContainer: {
        marginBottom: 5,
        height: RPW(56),
        width: RPW(98),
    },
    lineContainer: {
        alignItems: "flex-end",
        width: "100%",
        marginBottom: 25,
    },
    author: {
        color: "#2a0000",
        fontSize: RPW(3.2),
        fontWeight: "450",
        marginBottom: 15,
        fontFamily: "Barlow-Regular",
        letterSpacing: RPW(0.15),
    },
    gradientLine2: {
        width: "83%",
        height: 4,
        borderRadius: 15,
    },
    text1: {
        color: "#2a0000",
        fontSize: RPW(4.8),
        fontWeight: "500",
        marginBottom: 25,
        marginLeft: RPW(0),
        fontFamily: "Barlow-Bold",
        letterSpacing: RPW(0.1),
    },
    text2: {
        color: "#2a0000",
        fontSize: RPW(4.2),
        fontWeight: "500",
        marginBottom: 25,
        marginLeft: RPW(0),
        fontFamily: "Barlow-Medium",
        letterSpacing: RPW(0.1),
    },
    link: {
        color: "rgb(3, 0, 42)",
        fontSize: RPW(4.2),
        fontWeight: "500",
        marginBottom: 25,
        marginTop: -14,
        textDecorationLine : "underline",
        fontFamily: "Barlow-Medium",
        letterSpacing: RPW(0.1),
    },
    btnContainer: {
        marginTop: 35,
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    btn: {
        width: RPW(35),
        height: 45,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#0c0000",
    },
    btnText: {
        color: "white",
        fontSize: RPW(4.8),
        fontWeight: "500",
    },
    modal: {
        alignItems: "center"
    },
    modalBody: {
        height: RPH(32),
        width: RPW(90),
        borderRadius: 10,
        paddingTop: RPH(4),
        paddingBottom: RPH(4),
        backgroundColor: "#e7e7e7",
        position: "absolute",
        bottom: RPH(11),
        justifyContent: "space-between",
    },
    modalText: {
        color: "#2a0000",
        fontSize: RPW(4.5),
        fontWeight: "600",
        textAlign: "center",
        paddingLeft: RPW(6),
        paddingRight: RPW(6),
        lineHeight: RPH(4)
    },
    line2: {
        width: "90%",
        height: 4,
        marginTop: 0,
        backgroundColor: "rgb(157, 0, 0)",
        alignSelf : "center",
    },
})