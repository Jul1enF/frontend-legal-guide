import { RPH, RPW } from '../../../modules/dimensions'
import { registerForPushNotificationsAsync } from '../../../modules/registerForPushNotificationsAsync'

import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar, RefreshControl, Modal } from "react-native";
import { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { logout, changePushToken } from "../../../reducers/user";
import { addTestArticle } from "../../../reducers/testArticle";
import { deleteOneArticle, fillWithArticles } from "../../../reducers/articles"

import { router, Link, useFocusEffect } from "expo-router";

import YoutubePlayer from "react-native-youtube-iframe";

import NetInfo from '@react-native-community/netinfo'

import requires from "../../../modules/imageRequires";


export default function FullArticle() {

    const dispatch = useDispatch()
    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS

    const testArticle = useSelector((state) => state.testArticle.value)
    const articles = useSelector((state) => state.articles.value)
    const user = useSelector((state) => state.user.value)

    const [article, setArticle] = useState('')
    const [modalVisible, setModalVisible] = useState(false)

    const [error, setError] = useState('')




    // Fonction pour gérer les potentiels changement de push token

    const checkPushTokenChanges = async () => {
        const state = await NetInfo.fetch()

        // Si utilisateur pas inscrit ou pas connecté à internet ou pas admin
        if (!user.jwtToken || !state.isConnected || !user.is_admin) { return }

        const pushTokenInfos = await registerForPushNotificationsAsync(user.push_token, user.jwtToken)

        if (!pushTokenInfos) {
            dispatch(logout())
            router.push('/')
        }
        if (pushTokenInfos?.change || pushTokenInfos?.change === "") {
            dispatch(changePushToken(pushTokenInfos.change))
        }
    }


    // useFocusEffect pour vérifier si les notifs sont toujours autorisées

    useFocusEffect(useCallback(() => {
        checkPushTokenChanges()
    }, []))








    //  Fonction pour charger les articles

    const loadArticles = async () => {
        // S'il y a un article test, chargement de celui ci
        if (testArticle[0]?.category === "home") {
            setArticle(testArticle[0])
        }
        // Sinon fetch des articles en bdd

        else {
            // Le chargement du reducer avec les articles téléchargés ne sera effectif qu'au prochain refresh. Utilisation d'une variable pour setter les articles avec ceux téléchargés plutôt que le reducer pas encore actualisé.
            let downloadedArticles

            const state = await NetInfo.fetch()

            if (state.isConnected) {

                const response = await fetch(`${url}/articles/getArticles`)

                const data = await response.json()



                if (data.result) {
                    dispatch(fillWithArticles(data.articles))
                    downloadedArticles = data.articles
                }
                else if (data.err) {
                    dispatch(logout())
                    router.push('/')
                    return
                }
                else {
                    dispatch(logout())
                    router.push('/')
                    return
                }

            }
            if (downloadedArticles) {
                downloadedArticles.map(e => {
                    e.category === "home" && setArticle(e)
                })
            }
            else if (articles.length !== 0) {
                articles.map(e => {
                    e.category === "home" && setArticle(e)
                })
            }


        }

    }


    // useEffect pour charger les infos de l'article
    useEffect(() => {
        loadArticles()
    }, [testArticle])








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

    if (user.is_admin && article._id !== "testArticleId" && !article.test) {
        modifications = (
            <View style={[styles.btnContainer, {marginTop : RPW(12)}]}>
                <TouchableOpacity style={styles.btn} onPress={() => modifyPress()}>
                    <Text style={styles.btnText}>Modifier</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => setModalVisible(true)}>
                    <Text style={styles.btnText}>Supprimer</Text>
                </TouchableOpacity>
            </View>
        )
    }





    // Composant pour rafraichir la page

    const [isRefreshing, setIsRefreshing] = useState(false)

    const refreshComponent = <RefreshControl refreshing={isRefreshing} colors={["#0c0000"]} progressBackgroundColor={"#fffcfc"} tintColor={"#0c0000"} onRefresh={() => {
        setIsRefreshing(true)
        setTimeout(() => setIsRefreshing(false), 1000)
        loadArticles()
    }} />










    // Source de l'image à réquérir différement si elle est en ligne ou sur l'appareil

    const onlineImage = article && article.img_link.includes('https')

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





    if (!article) { return <View></View> }

    return (
        <View style={styles.body}>
            <StatusBar translucent={true} barStyle="light" />

            <ScrollView style={styles.body} contentContainerStyle={styles.contentBody}
                refreshControl={refreshComponent}>

                <Text style={[{ color: 'red' }, !error && { display: "none" }]}>{error}</Text>


                <Text style={styles.subTitle}>{article.sub_category} </Text>
                <Text style={styles.title}>{article.title}</Text>


                <View style={styles.line} >
                </View>

                {article.img_link &&
                    <View style={[styles.imgContainer, !article.author && { marginBottom: 25 }, { height: RPW(100 * article.img_ratio) }]} >
                        {image}
                    </View>}


                {article.author && <Text style={[styles.date, { marginBottom: RPW(6) }]}>{article.author}</Text>}

                {article.text1 && <Text style={styles.text1}>{article.text1}</Text>}

                {article.text2 && <Text style={styles.text2}>{article.text2}</Text>}

                {article.video_id &&
                    <View style={styles.youtubeContainer}>
                        <YoutubePlayer
                            height={RPW(56)}
                            width={RPW(98)}
                            videoId={article.video_id}
                            initialPlayerParams={{ modestbranding: false }}
                        />
                    </View>
                }

                {article.media_link && <Link style={styles.link} href={article.media_link}>{article.media_link}</Link>}

                <Text style={[{ color: 'red' }, !error && { display: "none" }]}>{error}</Text>

                {modifications}
            </ScrollView>

            <Modal
                visible={modalVisible}
                animationType="slide"
                style={styles.modal}
                transparent={true}
                onRequestClose={() => setModalVisible(!modalVisible)}
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
        paddingBottom: RPW(12),
    },
    categoryTitle: {
        color: "#0c0000",
        fontSize: RPW(5.5),
        lineHeight: RPW(5.5),
        marginBottom: 20,
        fontFamily: "Barlow-Medium",
        letterSpacing: RPW(-0.0),
    },
    subTitle: {
        color: "rgb(185, 0, 0)",
        fontSize: RPW(8),
        lineHeight: RPW(8),
        marginRight: RPW(3),
        fontFamily: "Barlow-Bold",
        letterSpacing: RPW(0.1),
        marginBottom: 20,
    },
    title: {
        color: "#0c0000",
        fontSize: RPW(7.3),
        lineHeight: RPW(7.5),
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
        color: "#0c0000",
        fontSize: RPW(3.2),
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
        marginBottom: 30,
        height: RPW(56),
        width: RPW(98),
    },
    lineContainer: {
        alignItems: "flex-end",
        width: "100%",
        marginBottom: 25,
    },
    author: {
        color: "#0c0000",
        fontSize: RPW(3.2),
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
        color: "#0c0000",
        fontSize: RPW(4.8),
        marginBottom: 25,
        marginLeft: RPW(0),
        fontFamily: "Barlow-Bold",
        letterSpacing: RPW(0.1),
    },
    text2: {
        color: "#0c0000",
        fontSize: RPW(4.2),
        marginBottom: 25,
        marginLeft: RPW(0),
        fontFamily: "Barlow-Medium",
        letterSpacing: RPW(0.1),
    },
    link: {
        color: "rgb(3, 0, 42)",
        fontSize: RPW(4.2),
        marginBottom: 25,
        marginTop: -14,
        textDecorationLine: "underline",
        fontFamily: "Barlow-Medium",
        letterSpacing: RPW(0.1),
    },
    btnContainer: {
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
        backgroundColor: "#dfdfdf",
        position: "absolute",
        bottom: RPH(11),
        left : RPW(5),
        justifyContent: "space-between",
    },
    modalText: {
        color: "#0c0000",
        fontSize: RPW(5),
        lineHeight : RPW(7),
        fontWeight: "600",
        textAlign: "center",
        paddingLeft: RPW(6),
        paddingRight: RPW(6),
    },
    line2: {
        width: "90%",
        height: 4,
        marginTop: 0,
        backgroundColor: "rgb(157, 0, 0)",
        alignSelf: "center",
    },
})