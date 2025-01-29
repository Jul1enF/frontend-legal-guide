import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, StatusBar } from 'react-native'
// import { registerForPushNotificationsAsync } from "../../../modules/registerForPushNotificationsAsync"
import { useCallback, useState, useEffect } from 'react'

import { RPW, RPH } from "../modules/dimensions"

import TopArticle from './TopArticle'
import Article from './Article'

import { router, useFocusEffect } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'

import { useSelector, useDispatch } from 'react-redux'
import { logout, changePushToken } from '../reducers/user'
import { fillWithArticles } from '../reducers/articles'

import NetInfo from '@react-native-community/netinfo'



export default function ArticlesList(props) {

    const user = useSelector((state) => state.user.value)
    const testArticle = useSelector((state) => state.testArticle.value)
    const articles = useSelector((state) => state.articles.value)
    const dispatch = useDispatch()

    // Tous les articles de cette catégorie
    const [thisCategoryArticles, setThisCategoryArticles] = useState("")
    // Articles à afficher, varie en cas de tri en fonction d'une sous catégorie
    const [articlesToDisplay, setArticlesToDisplay] = useState("")
    const [chosenSubcategory, setChosenSubcategory] = useState("")
    const [subcategoriesList, setSubcategoriesList] = useState("")

    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS




    // Fonction, État et useFocusEffect pour déterminer si l'utilisateur est connecté à internet

    const [isOnline, setIsOnline] = useState(true)

    const checkNetConnection = async () => {
        const state = await NetInfo.fetch()
        state.isConnected ? setIsOnline(true) : setIsOnline(false)
    }

    useFocusEffect(useCallback(() => {
        checkNetConnection
    }, []))




    // Fonction pour gérer les potentiels changement de push token

    // const checkPushTokenChanges = async () => {
    //     const state = await NetInfo.fetch()

    //     // Si utilisateur pas inscrit ou connecté
    //     if (!user.token || !state.isConnected) { return }

    //     const pushTokenInfos = await registerForPushNotificationsAsync(user.push_token, user.token)

    //     if (!pushTokenInfos) {
    //         dispatch(logout())
    //         router.navigate('/')
    //     }
    //     if (pushTokenInfos?.change || pushTokenInfos?.change === "") {
    //         dispatch(changePushToken(pushTokenInfos.change))
    //     }
    // }


    // useFocusEffect pour vérifier si les notifs sont toujours autorisées

    // useFocusEffect(useCallback(() => {
    //     checkPushTokenChanges()
    // }, [user]))





    // État pour définir l'appelation de la première sous catégorie avec tous les articles de cette catégorie
    const [firstSubCategory, setFirstSubCategory] = useState("Tous les articles de cette catégorie")

    //  Fonction pour charger les articles et trier les sous catégories

    const loadArticles = async () => {

        // S'il y a un article test, chargement de celui ci
        if (user?.is_admin && testArticle[0]?.category === props.category) {
            setArticlesToDisplay(testArticle)
        }
        // Sinon fetch des articles en bdd

        else {

            // Le chargement du reducer avec les articles téléchargés ne sera effectif qu'au prochain refresh. Utilisation d'une variable pour setter les articles avec ceux téléchargés plutôt que le reducer pas encore actualisé.
            let downloadedArticles

            const state = await NetInfo.fetch()

            if (state.isConnected) {
                setIsOnline(true)

                const response = await fetch(`${url}/articles/getArticles`)

                const data = await response.json()


                if (data.result) {
                    dispatch(fillWithArticles(data.articles))
                    downloadedArticles = data.articles
                }
                else if (data.err) {
                    dispatch(logout())
                    router.navigate('/')
                    return
                }
                else {
                    dispatch(logout())
                    router.navigate('/')
                    return
                }

            }

            !state.isConnected && setIsOnline(false)


            // Tri des articles par catégorie
            if (articles.length !== 0 || downloadedArticles) {
                let categoryArticles = downloadedArticles ? downloadedArticles.filter(e => e.category === props.category) : articles.filter(e => e.category === props.category)

                categoryArticles.reverse()


                setThisCategoryArticles(categoryArticles)
                setArticlesToDisplay(categoryArticles)


                // Tri pour les sous catégories
                let sortedSubcategories

                switch (props.category) {
                    case 'tab1':
                        sortedSubcategories = [{ name: "Toutes les recettes" }]
                        setChosenSubcategory("Toutes les recettes")
                        setFirstSubCategory("Toutes les recettes")
                        break;
                    case 'tab2':
                        console.log('tab2');
                        break;
                }

                categoryArticles.map(e => {
                    if (e.sub_title && !sortedSubcategories.some(j => j.name === e.sub_title)) {
                        sortedSubcategories.push({ name: e.sub_title })
                    }
                })
                setSubcategoriesList(sortedSubcategories)
            }
        }
    }

    useEffect(() => {
        loadArticles()
    }, [testArticle])




    // Fonction appelée au click sur une sous catégorie

    const subcategoryPress = (subcategory) => {
        setChosenSubcategory(subcategory)

        if (subcategory === firstSubCategory) {
            setArticlesToDisplay(thisCategoryArticles)
        }
        else {
            setArticlesToDisplay(thisCategoryArticles.filter(e => e.sub_title == subcategory))
        }
    }



    // Item à afficher dans la flatlist horizontale pour choisir la sous catégorie

    const SubcategoryItem = (props) => {

        return (
            <LinearGradient
                colors={['#cb0000', '#230000']}
                locations={[0.15, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.gradientBtn1}
            >
                <TouchableOpacity style={[styles.btn, chosenSubcategory === props.name && { backgroundColor: "transparent" }]} onPress={() => subcategoryPress(props.name)}>
                    <Text style={[styles.btnText, chosenSubcategory !== props.name && { color: "#2a0000" }]}>{props.name}</Text>
                </TouchableOpacity>
            </LinearGradient>
        )
    }




    // Fonction appelée en cliquant sur un article

    const articlePress = (_id, test) => {
        test ? router.push(`/${props.category}-article/testArticleId`) : router.push(`/${props.category}-article/${_id}`)
    }



    // Composant pour rafraichir la page

    const [isRefreshing, setIsRefreshing] = useState(false)

    const refreshComponent = <RefreshControl refreshing={isRefreshing} colors={["#2a0000"]} progressBackgroundColor={"white"} tintColor={"#2a0000"} onRefresh={() => {
        setIsRefreshing(true)
        setTimeout(() => setIsRefreshing(false), 1000)
        loadArticles()
    }} />




    return (
        <View style={styles.body} >
            <StatusBar translucent={true} barStyle="light" />
            <FlatList
                data={subcategoriesList}
                horizontal={true}
                style={{ minHeight: RPW(12.5), maxHeight: RPW(12.5), minWidth: RPW(100), borderBottomColor: "#878787", borderBottomWidth: 0.5 }}
                renderItem={({ item }) => {
                    return <SubcategoryItem {...item} />
                }}
                contentContainerStyle={{ alignItems: 'center', paddingLeft: RPW(2) }}
            />
            <FlatList
                data={articlesToDisplay}
                refreshControl={refreshComponent}
                renderItem={({ item, index }) => {
                    if (index === 0 || Number.isInteger((index) / 3)) {
                        return <TouchableOpacity onPress={() => articlePress(item._id, item.test)} ><TopArticle {...item} chosenSubcategory={chosenSubcategory} /></TouchableOpacity>
                    }
                    else {
                        return <TouchableOpacity onPress={() => articlePress(item._id, item.test)} ><Article {...item} /></TouchableOpacity>
                    }
                }}
                contentContainerStyle={{ alignItems: 'center' }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: "#fffcfc",
        flex: 1,
    },
    gradientBtn1: {
        height: RPW(8.3),
        borderRadius: 8,
        marginRight: RPW(2.3)
    },
    btn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#e7e7e7",
        margin: 0,
        borderRadius: 8,
        paddingLeft: RPW(2),
        paddingRight: RPW(2),
    },
    btnText: {
        color: "white",
        // fontSize: RPW(4.65),
        fontSize : RPW(4),
        fontWeight: "500",
        // fontFamily: "Barlow-SemiBold",
        // letterSpacing: RPW(0.2),
    },
})