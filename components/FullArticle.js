import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar, Modal } from "react-native";
import { useEffect, useState, useCallback, useRef } from 'react'
import { useFocusEffect } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { addBookmark, removeBookmark } from "../reducers/user";
import { addTestArticle } from "../reducers/testArticle";
import { deleteOneArticle } from "../reducers/articles"
import { RPH, RPW } from "../modules/dimensions"

import { router, Link } from "expo-router";

import Icon from "@expo/vector-icons/MaterialCommunityIcons"
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import YoutubePlayer from "react-native-youtube-iframe";
import moment from 'moment/min/moment-with-locales'

import requires from "../modules/imageRequires";
import NetInfo from "@react-native-community/netinfo";


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








    // Fonction, État et useFocusEffect pour déterminer si l'utilisateur est connecté à internet (pour affichage de l'image)

    const [isOnline, setIsOnline] = useState(true)

    const checkNetConnection = async () => {
        const state = await NetInfo.fetch()
        state.isConnected ? setIsOnline(true) : setIsOnline(false)
    }

    useFocusEffect(useCallback(() => {
        checkNetConnection()
    }, [imageLoadError]))









    // useFocusEffect pour vérifier si l'article est en favoris, naviguer vers la liste d'articles si l'article test a été supprimé ou si un nouveau a été mis en test

    useFocusEffect(useCallback(() => {
        // Si utilisateur pas connecté
        if (!user.jwtToken) { return }
        user.bookmarks.includes(_id) ? setIsBookmarked(true) : setIsBookmarked(false)

        if (_id === "testArticleId" && testArticle.length === 0) { router.back(`/${category}/none`) }

        if (testArticle.length > 0 && testArticle[0].category === category && _id !== "testArticleId") { router.back(`/${category}/none`) }
    }, [user, testArticle]))






    // Fonction appelée en cliquant sur l'icone favoris
    const bookmarkPress = async () => {
        if (_id === "testArticleId" || article.test) {
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
                if (props.category === "bookmarks") {
                    router.back("/bookmarks")
                }
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
            // Index de l'article pour revenir scroller jusqu'à lui dans la liste après une modif et un post de celle ci
            index: props.articlesListIndex,
            // test : true => Un article déjà posté n'a pas un _id "testArticleId" mais peut être mis en test. C'est donc cet indicateur qui sert à savoir ensuite si l'on affiche la page détaillée d'un article en test ou en BDD
            test: true,
        }))

        router.push('/redaction')
    }



    // Fonction appelée en cliquant sur Supprimer

    const deleteRef = useRef(true)

    const deletePress = async () => {

        if (!deleteRef.current) { return }
        deleteRef.current = false

        let data
        try {
            const response = await fetch(`${url}/articles/delete-article/${user.jwtToken}/${article._id}`, { method: 'DELETE' })

            data = await response.json()
        } catch (err) {
            setModalVisible(false)
            setError("Erreur : Problème de connexion")
            setTimeout(() => setError(''), 4000)
            deleteRef.current = true
            return
        }


        if (!data.result && data.error) {
            setModalVisible(false)
            setError(data.error)
            setTimeout(() => setError(''), 4000)
            deleteRef.current = true
        }
        else if (!data.result) {
            setModalVisible(false)
            setError("Problème de connexion à la base de donnée, merci réessayer après avoir quitté l'app et vous être reconnecté.")
            setTimeout(() => setError(''), 4000)
            deleteRef.current = true
        }
        else {
            dispatch(deleteOneArticle(article._id))
            setModalVisible(false)
            deleteRef.current = true
            router.push(`/${article.category}/${props.articlesListIndex}`)
        }
    }




    // Boutons pour modifications si l'utilsateur est admin

    let modifications

    if (user.is_admin && _id !== "testArticleId") {
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





    // Source de l'image à réquérir différement si elle est en ligne, sur l'appareil ou si le portable est offline

    const [imageLoadError, setImageLoadError] = useState(false)
    const backupImage = (!isOnline && imageLoadError) ? true : false

    let image
    if (requires[article.img_link] === undefined) {
        if (!isOnline && imageLoadError) {
            image = <Image
                style={[styles.image, { width: RPW(100) }]}
                source={props.category === "advices" ? require('../assets/backup-advices1.jpg') : require('../assets/backup-press1.jpg')}
            />
        } else {
            image = <Image
                style={[styles.image, {
                    width: RPW(100 * article.img_zoom),
                    marginTop: RPW(article.img_margin_top * 1),
                    marginLeft: RPW(article.img_margin_left * 1)
                }]}
                source={{ uri: article.img_link }}
                onError={({ nativeEvent: { error } }) => setImageLoadError(true)}
                onLoad={() => { setImageLoadError(false) }}
            />
        }
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
            <View style={styles.header} >
                <TouchableOpacity style={styles.headerSection} onPress={() => {
                    if (category === "searches") {
                        router.back(`/${category}/${props.searchedText}`)
                    } else if (category === "bookmarks") {
                        router.back(`/${category}`)
                    } else {
                        router.back(`/${category}/none`)
                    }
                }
                }>
                    <FontAwesome5 name="chevron-left" color="white" size={RPW(4.2)} style={styles.icon} />
                    <Text style={styles.headerText}>{props.categoryName}</Text>
                </TouchableOpacity>
                {(user.jwtToken && article._id !== "testArticleId") && <TouchableOpacity style={styles.headerSection2} onPress={() => bookmarkPress()}>
                    <Text style={styles.headerText} >{isBookmarked ? "Retirer des favoris" : "Ajouter aux favoris"}</Text>
                    <Icon name={isBookmarked ? "heart-remove" : "heart-plus"} size={RPH(2.9)} color={isBookmarked ? "rgb(185, 0, 0)" : "white"} style={styles.icon2} />
                </TouchableOpacity>}
            </View>

            <Text style={[{ color: 'red' }, !error && { display: "none" }]}>{error}</Text>

            <ScrollView style={styles.body} contentContainerStyle={styles.contentBody}>
                <Text style={styles.categoryTitle}>{props.categoryNameSingular}</Text>

                {article.sub_category && <Text style={styles.subTitle}>{article.sub_category} </Text>}

                <Text style={styles.title}>{article.title}</Text>


                <View style={styles.line} >
                </View>
                <Text style={styles.date}>Publié le {date} à {hour}</Text>

                {article.img_link &&
                    <View style={[styles.imgContainer, !article.author && { marginBottom: 25 }, { height: backupImage ? RPW(100) : RPW(100 * article.img_ratio) }]} >
                        {image}
                    </View>}


                {article.author && <Text style={[styles.date, { marginBottom: RPW(7) }]}>par {article.author}</Text>}

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

                <Text style={[{ color: 'red', fontSize: RPW(4.5) }, !error && { display: "none" }]}>{error}</Text>

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
                    <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
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
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    icon: {
        marginRight: RPW(3)
    },
    headerSection2: {
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
        color: "#0c0000",
        fontSize: RPW(5.5),
        lineHeight: RPW(5.5),
        marginBottom: 20,
        fontFamily: "Barlow-Medium",
        letterSpacing: RPW(-0.0),
    },
    subTitle: {
        color: "rgb(185, 0, 0)",
        fontSize: RPW(7.3),
        lineHeight: RPW(8.4),
        marginRight: RPW(3),
        fontFamily: "Barlow-Bold",
        letterSpacing: RPW(0.1),
        marginBottom: 8,
    },
    title: {
        color: "#0c0000",
        fontSize: RPW(7.3),
        lineHeight: RPW(8.4),
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
        fontSize: RPW(4),
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
        fontSize: RPW(4),
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
        fontSize: RPW(5.3),
        marginBottom: 25,
        marginLeft: RPW(0),
        fontFamily: "Barlow-Bold",
        letterSpacing: RPW(0.1),
    },
    text2: {
        color: "#0c0000",
        fontSize: RPW(5),
        marginBottom: 25,
        marginLeft: RPW(0),
        fontFamily: "Barlow-Medium",
        letterSpacing: RPW(0.1),
    },
    link: {
        color: "rgb(8, 0, 123)",
        fontSize: RPW(5),
        marginBottom: 25,
        marginTop: -14,
        textDecorationLine: "underline",
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
        height: RPW(12),
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
        height: RPW(60),
        width: RPW(90),
        borderRadius: 10,
        paddingTop: RPH(4),
        paddingBottom: RPH(4),
        backgroundColor: "#e7e7e7",
        position: "absolute",
        bottom: RPH(11),
        left: RPW(5),
        justifyContent: "space-between",
    },
    modalText: {
        color: "#0c0000",
        fontSize: RPW(5),
        lineHeight: RPW(7),
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