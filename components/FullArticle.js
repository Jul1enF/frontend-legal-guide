import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar } from "react-native";
import { useEffect, useState, useCallback } from 'react'
import { useFocusEffect } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { addBookmark, removeBookmark } from "../reducers/user";
import { addTestArticle } from "../reducers/testArticle";
import { deleteOneArticle } from "../reducers/articles"
import { RPH, RPW } from "../modules/dimensions"

import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import Modal from "react-native-modal"
import Icon from "@expo/vector-icons/MaterialCommunityIcons"
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import YoutubePlayer from "react-native-youtube-iframe";
import moment from 'moment/min/moment-with-locales'


export default function FullArticle(props) {

    const { category } = props
    const { _id } = props
    console.log(_id)

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




    // useFocusEffect pour vérifier si l'article est en favoris, naviguer vers recette si l'article test a été supprimé ou si un nouveau a été mis en test

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
            sub_title: article.sub_title,
            text: article.text,
            video_id: article.video_id,
            category: article.category,
            img_link: article.img_link,
            img_margin_top: article.img_margin_top,
            img_margin_left: article.img_margin_left,
            img_zoom: article.img_zoom,
            img_public_id: article.img_public_id,
            createdAt: article.createdAt,
            _id: article._id,
            author: article.author,
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

    if (user.is_admin && _id !== "testArticleId") {
        modifications = (
            <View style={styles.btnContainer}>
                <LinearGradient
                    colors={['#cb0000', '#230000']}
                    locations={[0.15, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientBtn}
                >
                    <TouchableOpacity style={styles.btn} onPress={() => modifyPress()}>
                        <Text style={styles.btnText}>Modifier</Text>
                    </TouchableOpacity>
                </LinearGradient>
                <LinearGradient
                    colors={['#cb0000', '#230000']}
                    locations={[0.15, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientBtn}
                >
                    <TouchableOpacity style={styles.btn} onPress={() => setModalVisible(true)}>
                        <Text style={styles.btnText}>Supprimer</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        )
    }

    moment.locale('fr')
    const date = moment(article.createdAt).format('LL')
    const hour = moment(article.createdAt).format('LT')


    if (!article) { return <View></View> }

    return (
        <View style={styles.body}>
            <StatusBar translucent={true} barStyle="light" />
            <LinearGradient
                colors={['#cb0000', '#230000']}
                locations={[0.15, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.header}
            >
                <TouchableOpacity style={styles.headerSection} onPress={() => router.back(`/${category}`)}>
                    <FontAwesome5 name="chevron-left" color="white" size={RPW(4.2)} style={styles.icon} />
                    <Text style={styles.headerText}>{props.categoryName}</Text>
                </TouchableOpacity>
                {user.jwtToken && <TouchableOpacity style={styles.headerSection2} onPress={() => bookmarkPress()}>
                    <Text style={styles.headerText} >{isBookmarked ? "Retirer des favoris" : "Ajouter aux favoris"}</Text>
                    <Icon name={isBookmarked ? "heart-remove" : "heart-plus"} size={RPH(2.9)} color={isBookmarked ? "#ff00e8" : "white"} style={styles.icon2} />
                </TouchableOpacity>}
            </LinearGradient>

            <Text style={[{ color: 'red' }, !error && { display: "none" }]}>{error}</Text>

            <ScrollView style={styles.body} contentContainerStyle={styles.contentBody}>
                <Text style={styles.categoryTitle}>{props.categoryNameSingular}</Text>


                <Text style={styles.subTitle}>{article.sub_title} </Text>
                <Text style={styles.title}>{article.title}</Text>


                <LinearGradient
                    colors={['#cb0000', '#230000']}
                    locations={[0.15, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.gradientLine}
                >
                </LinearGradient>
                <Text style={styles.date}>Publié le {date} à {hour}</Text>

                {article.img_link &&
                    <View style={[styles.imgContainer, !article.author && { marginBottom: 25 }]} >
                        <Image
                            style={[styles.image, {
                                width: RPW(98 * article.img_zoom),
                                marginTop: RPW(article.img_margin_top * 0.98),
                                marginLeft: RPW(article.img_margin_left * 0.98)
                            }]}
                            source={{ uri: article.img_link }}
                        />
                    </View>}



                {/* <View style={styles.lineContainer}>
                    {article.author && <Text style={styles.date}>par {article.author}</Text>}
                    <LinearGradient
                        colors={['#cb0000', '#230000']}
                        locations={[0.15, 1]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.gradientLine2}
                    >
                    </LinearGradient>
                </View> */}

                {article.author && <Text style={[styles.date, {marginBottom : RPW(7)}]}>par {article.author}</Text>}

                {article.text && <Text style={styles.text}>{article.text}</Text>}

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
                    <View style={styles.btnContainer}>
                        <LinearGradient
                            colors={['#cb0000', '#230000']}
                            locations={[0.15, 1]}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.gradientBtn}
                        >
                            <TouchableOpacity style={styles.btn} onPress={() => setModalVisible(false)}>
                                <Text style={styles.btnText}>Annuler</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                        <LinearGradient
                            colors={['#cb0000', '#230000']}
                            locations={[0.15, 1]}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.gradientBtn}
                        >
                            <TouchableOpacity style={styles.btn} onPress={() => deletePress()}>
                                <Text style={styles.btnText}>Supprimer</Text>
                            </TouchableOpacity>
                        </LinearGradient>
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
        height: RPW(10.5),
        width: RPW(100),
        paddingLeft: RPW(4),
        paddingRight: RPW(4),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
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
    gradientLine: {
        width: "30%",
        height: 3.5,
        marginBottom: 15,
        marginLeft : RPW(1),
        borderRadius: 15,
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
        width: RPW(98),
        height: RPW(54),
        overflow: "hidden",
        justifyContent: "center",
        marginBottom: 12,
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
    text: {
        color: "#2a0000",
        fontSize: RPW(4.2),
        fontWeight: "500",
        marginBottom: 25,
        marginLeft : RPW(0),
        fontFamily: "Barlow-Medium",
        letterSpacing: RPW(0.1),
    },
    btnContainer: {
        marginTop: 35,
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    gradientBtn: {
        width: "40%",
        height: 45,
        borderRadius: 10,
    },
    btn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
        height: RPH(27),
        width: RPW(90),
        borderRadius: 10,
        paddingTop: RPH(4),
        paddingBottom: RPH(4),
        backgroundColor: "#e7e7e7",
        position: "absolute",
        bottom: RPH(11),
        justifyContent: "space-between"
    },
    modalText: {
        color: "#2a0000",
        fontSize: RPW(4.5),
        fontWeight: "600",
        textAlign: "center",
        paddingLeft: RPW(6),
        paddingRight: RPW(6),
        lineHeight: RPH(4)
    }
})