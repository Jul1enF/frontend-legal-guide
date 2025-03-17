import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, StatusBar, Image } from 'react-native'
import { registerForPushNotificationsAsync } from "../modules/registerForPushNotificationsAsync"
import { useCallback, useState, useEffect, useRef, useLayoutEffect } from 'react'

import { RPW, RPH } from "../modules/dimensions"

import TopArticle from './TopArticle'
import Article from './Article'

import { router, useFocusEffect } from 'expo-router'

import { useSelector, useDispatch } from 'react-redux'
import { logout, changePushToken } from '../reducers/user'
import { fillWithArticles } from '../reducers/articles'

import NetInfo from '@react-native-community/netinfo'




export default function ArticlesList(props) {

    const user = useSelector((state) => state.user.value)
    const testArticle = useSelector((state) => state.testArticle.value)
    const articles = useSelector((state) => state.articles.value)
    const dispatch = useDispatch()

    // Tous les articles concernés par cette page
    const [allConcernedArticles, setAllConcernedArticles] = useState("")

    // Articles à afficher, varie en cas de tri d'une catégorie ou sous catégorie
    const [articlesToDisplay, setArticlesToDisplay] = useState("")


    const [chosenSubcategory, setChosenSubcategory] = useState("")
    const [subcategoriesList, setSubcategoriesList] = useState("")

    // Bookmarks : Sous catégorie de la catégorie choisie
    const [chosenSubcategory2, setChosenSubcategory2] = useState("")
    const [subcategoriesList2, setSubcategoriesList2] = useState("")

    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS

    // Ref pour garder en mémoire les sous catégories choisies en cas de rafraichissement de la page
    const previousSubcategory1Ref = useRef(null)
    const previousSubcategory2Ref = useRef(null)



    // useRefpour scroller jusqu'à un article qui vient d'être modifié en retour d'un post

    const verticalFlatlistRef = useRef(null)



    // Bookmarks : Fonction et useEffect pour vérifier s'il y a plusieurs catégories d'articles en favoris. Si qu'une seule, on affiche directement les sous catégorie

    const isThereOnlyOneCategoryBookmarked = () => {
        if (props.category === "bookmarks") {

            if (allConcernedArticles.some(e => e.category == "advices") && allConcernedArticles.some(e => e.category == "press")) {
                return false
            } else if (allConcernedArticles.some(e => e.category == "advices")) {
                return "Conseils"
            } else if (allConcernedArticles.some(e => e.category == "press")) {
                return "Presse"
            }
        } else {
            return false
        }
    }

   
    // useEffect Bookmarks pour potentiellement afficher directement les sous catégories et revenir à une catégorie précédente
    useEffect(() => {
        if (allConcernedArticles) {
            if (isThereOnlyOneCategoryBookmarked()){
                subcategoryPress(isThereOnlyOneCategoryBookmarked())
            }
            else if (props.category === "bookmarks"){
                // Pour revenir aux sous catégories précédemment choisies, si toujours présentes
                if (previousSubcategory1Ref.current && subcategoriesList.some(e=> e.name === previousSubcategory1Ref.current)){

                    subcategoryPress(previousSubcategory1Ref.current)
                }
            }
        }
    }, [allConcernedArticles])

    //useEffect Bookmarks pour potentiellement revenir à une sous catégorie précédente

    useEffect(()=>{
        if (props.category === "bookmarks" && subcategoriesList2){
            if (previousSubcategory2Ref.current && subcategoriesList2.some(e=> e.name === previousSubcategory2Ref.current)){

                subcategoryPress2(previousSubcategory2Ref.current)
            }
        }
    },[subcategoriesList2])





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






    // Bookmarks : fonctions pour traduire le nom des catégories en français ou en anglais (pour affichage ou tri des premières sous catégories)

    const frenchTranslation = (selectedCategory) => {
        const translationTable = [{ category: "advices", name: "Conseils" }, { category: "press", name: "Presse" }]

        let translatedName

        translationTable.map(e => {
            if (e.category === selectedCategory) {
                translatedName = e.name
            }
        })

        return translatedName
    }

    const englishTranslation = (selectedName) => {
        const translationTable = [{ category: "advices", name: "Conseils" }, { category: "press", name: "Presse" }]

        let translatedName

        translationTable.map(e => {
            if (e.name === selectedName) {
                translatedName = e.category
            }
        })

        return translatedName
    }





    // État pour définir l'appelation de la première sous catégorie avec tous les articles de cette catégorie
    const [firstSubCategory, setFirstSubCategory] = useState("Tous les articles de cette catégorie")



    // Ref pour définir le type de recherche
    const searchMethodRef = useRef("occurence")

    // Fonction pour trouver les articles liés à la recherche
    const selectSearchedArticles = () => {
        const regex = new RegExp(props.searchedText, "i")
        const searchMethod = searchMethodRef.current
        let searchedArticles

        if (searchMethod === "occurence") {
            searchedArticles = articles.filter(e =>
                regex.test(e.title) || regex.test(e.sub_category) || regex.test(e.text1) || regex.test(e.text2) || e.tags.some(f => regex.test(f))
            )
        } else if (searchMethod === "tags") {
            searchedArticles = articles.filter(e =>
                regex.test(e.sub_category) || e.tags.some(f => regex.test(f))
            )
        } else if (searchMethod === "title") {
            searchedArticles = articles.filter(e =>
                regex.test(e.title)
            )
        }

        return searchedArticles
    }



    //  Fonction pour charger les articles et trier les sous catégories

    const loadArticles = async () => {
        // Reset de la deuxième liste de sous catégorie pour bookmarks
        setSubcategoriesList2("")

        // S'il y a un article test, chargement de celui ci
        if (testArticle[0]?.category === props.category) {
            setArticlesToDisplay(testArticle)
        }
        // Sinon fetch des articles en bdd

        else {

            // Le chargement du reducer avec les articles téléchargés ne sera effectif qu'au prochain refresh. Utilisation d'une variable pour setter les articles avec ceux téléchargés plutôt que le reducer pas encore actualisé.
            let downloadedArticles

            const state = await NetInfo.fetch()

            if (state.isConnected && props.category !== "bookmarks" && props.category !== "searches") {

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


            // Tri des articles concernés par cette page
            if (articles.length !== 0 || downloadedArticles) {
                let concernedArticles

                // Bookmarks (Vérification des articles enregistrés par le user)
                if (props.category === "bookmarks" && user.jwtToken) {
                    let bookmarkedArticles = []

                    for (let article of articles) {
                        for (let bookmark of user.bookmarks) {
                            if (article._id === bookmark) {
                                bookmarkedArticles.push(article)
                            }
                        }
                    }
                    concernedArticles = [...bookmarkedArticles]
                }
                // Articles de recherche
                else if (props.category === "searches") {
                    concernedArticles = selectSearchedArticles()
                }
                // Articles presse et conseil
                else {
                    concernedArticles = downloadedArticles ? downloadedArticles.filter(e => e.category === props.category) : articles.filter(e => e.category === props.category)
                }

                concernedArticles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))


                setAllConcernedArticles(concernedArticles)
                setArticlesToDisplay([...concernedArticles])


                // Tri pour les sous catégories
                let sortedSubcategories

                switch (props.category) {
                    case 'advices':
                        sortedSubcategories = [{ name: "Tous les conseils", count: 1000000 }]
                        setChosenSubcategory("Tous les conseils")
                        setFirstSubCategory("Tous les conseils")
                        break;
                    case 'press':
                        sortedSubcategories = [{ name: "Tous les articles", count: 1000000 }]
                        setChosenSubcategory("Tous les articles")
                        setFirstSubCategory("Tous les articles");
                        break;
                    case 'bookmarks':
                        sortedSubcategories = [{ name: "Tous les favoris", count: 1000000 }]
                        setChosenSubcategory("Tous les favoris")
                        setFirstSubCategory("Tous les favoris");
                        break;
                    case 'searches':
                        sortedSubcategories = [{ name: "Tous les articles", count: 1000000 }]
                        setChosenSubcategory("Tous les articles")
                        setFirstSubCategory("Tous les articles");
                        break;
                }

                // Tri des sous catégories par nombre d'occurence
                concernedArticles.map(e => {
                    let itemPresence = false

                    sortedSubcategories.map(j => {
                        // Bookmarks (On utilise la catégorie et non pas la sous catégorie qui sera dans la 2ème liste)
                        if (props.category === "bookmarks" && j.name === frenchTranslation(e.category)) {
                            j.count++
                            itemPresence = true
                        }
                        // Articles advices et press (tri par sous catégorie d'article)
                        else if (j.name === e.sub_category) {
                            j.count++
                            itemPresence = true
                        }
                    })

                    // Bookmarks
                    if (props.category === "bookmarks" && !itemPresence) {
                        sortedSubcategories.push({ name: frenchTranslation(e.category), count: 1 })
                    }
                    // Articles advices et press
                    else if (!itemPresence) {
                        sortedSubcategories.push({ name: e.sub_category, count: 1 })
                    }
                })

                sortedSubcategories.sort((a, b) => b.count - a.count)

                setSubcategoriesList(sortedSubcategories)
            }
        }
    }


    // useEffect quand ce n'est pas bookmarks (pour ne pas recharger la page en ajoutant un favoris => on ne met pas user dans les dépendances)
    useEffect(() => {
        if (props.category !== "bookmarks") {
            // Reset de la méthode de recherche quand le composant est monté à nouveau
            searchMethodRef.current = "occurence"

            horizontalFlatlist0Ref.current && horizontalFlatlist0Ref.current.scrollToOffset({
                offset: 0,
                animated: true,
            })

            loadArticles()
        }
    }, [testArticle, props.searchedText])

    // useEffect pour bookmarks pour charger les articles
    
    useEffect(() => {
        if (props.category === "bookmarks") {
            loadArticles()
        }
    }, [user])




    // Useref pour le scroll de la ou les Flatlist horizontale avec les sous catégories
    const horizontalFlatlist0Ref = useRef(null)
    const horizontalFlatlistRef = useRef(null)
    const horizontalFlatlist2Ref = useRef(null)






    // Fonction appelée au click sur une sous catégorie

    const subcategoryPress = (subcategory, index) => {
        setChosenSubcategory(subcategory)
        previousSubcategory1Ref.current = subcategory

        index && horizontalFlatlistRef.current.scrollToIndex({
            animated: true,
            index,
            viewOffset: RPW(5)
        })

        if (subcategory === firstSubCategory) {
            setArticlesToDisplay(allConcernedArticles)
            setSubcategoriesList2("")
            previousSubcategory2Ref.current = null
        }
        else {
            // Articles advices et press
            if (props.category !== "bookmarks") {
                setArticlesToDisplay(allConcernedArticles.filter(e => e.sub_category == subcategory))
            }
            // Bookmarks
            else {
                setArticlesToDisplay(allConcernedArticles.filter(e => e.category == englishTranslation(subcategory)))

                // Création d'une deuxième liste de sous catégorie en fonction du type de catégorie de bookmarks choisi
                let sortedSubcategories2

                if (subcategory === "Conseils") {
                    sortedSubcategories2 = [{ name: isThereOnlyOneCategoryBookmarked() ? "Tous les favoris" : "Tous les conseils", count: 100000000 }]
                }
                if (subcategory === "Presse") {
                    sortedSubcategories2 = [{ name: isThereOnlyOneCategoryBookmarked() ? "Tous les favoris" : "Tous les articles", count: 100000000 }]
                }

                setChosenSubcategory2(sortedSubcategories2[0].name)


                allConcernedArticles.map(e => {

                    let itemPresence = false

                    e.category === englishTranslation(subcategory) && sortedSubcategories2.map(j => {
                        if (j.name === e.sub_category) {
                            j.count++
                            itemPresence = true
                        }
                    })
                    if (!itemPresence && e.category === englishTranslation(subcategory)) {
                        sortedSubcategories2.push({ name: e.sub_category, count: 1 })
                    }
                })
                sortedSubcategories2.sort((a, b) => b.count - a.count)

                setSubcategoriesList2(sortedSubcategories2)
            }
        }
    }






    // Fonction appelée en cas de click sur une sous catégorie de la deuxième liste (celle de bookmarks)

    const subcategoryPress2 = (subcategory, index) => {
        index && horizontalFlatlist2Ref.current.scrollToIndex({
            animated: true,
            index,
            viewOffset: RPW(5)
        })

        setChosenSubcategory2(subcategory)
        previousSubcategory2Ref.current = subcategory

        if (subcategory === subcategoriesList2[0].name) {

            setArticlesToDisplay(allConcernedArticles.filter(e => e.category === englishTranslation(chosenSubcategory)))
        }
        else {

            setArticlesToDisplay(allConcernedArticles.filter(e => e.sub_category == subcategory && e.category === englishTranslation(chosenSubcategory)))
        }
    }






    // Item à afficher dans la flatlist horizontale pour choisir la première sous catégorie

    const SubcategoryItem = (props) => {

        return (
            <View style={styles.btnContainer}>
                <TouchableOpacity style={[styles.btn, chosenSubcategory === props.name && { backgroundColor: "transparent" }]} onPress={() => subcategoryPress(props.name, props.index)}>
                    <Text style={[styles.btnText, chosenSubcategory !== props.name && { color: "#0c0000" }]}>{props.name}</Text>
                </TouchableOpacity>
            </View>
        )
    }



    // Item à afficher dans la flatlist horizontale pour choisir la deuxième sous catégorie (sous catégories de bookmarks)

    const SubcategoryItem2 = (props) => {

        return (
            <View style={styles.btnContainer}>
                <TouchableOpacity style={[styles.btn, chosenSubcategory2 === props.name && { backgroundColor: "transparent" }]} onPress={() => subcategoryPress2(props.name, props.index)}>
                    <Text style={[styles.btnText, chosenSubcategory2 !== props.name && { color: "#0c0000" }]}>{props.name}</Text>
                </TouchableOpacity>
            </View>
        )
    }




    // Fonction appelée en cliquant sur un article

    const articlePress = (_id, test, index) => {
        if (test) {
            router.push(`/${props.category}-article/testArticleId`)
        } else if (props.category === "searches") {
            router.push(`/${props.category}-article/${_id}/${props.searchedText}`)
        } else if (props.category == "bookmarks"){
            router.push(`/${props.category}-article/${_id}`)
        }
        else {
            router.push(`/${props.category}-article/${_id}/${index}`)
        }
    }





    // Composants, data et fonction pour la flatlist affichée en recherche

    const headerFlatlist0 = (
        <View style={styles.btnContainer2}>
            <Text style={styles.btnText2}>Rechercher :</Text>
        </View>
    )


    const flatlist0Data = [{ name: "Par occurences", search: "occurence" }, { name: "Par catégories / tags", search: "tags" }, { name: "Par titre", search: "title" }]

    const subcategoryPress0 = (search, index) => {
        horizontalFlatlist0Ref.current.scrollToIndex({
            animated: true,
            index,
            viewOffset: RPW(5)
        })
        searchMethodRef.current = search
        loadArticles()
    }

    const SubcategoryItem0 = (props) => {

        return (
            <View style={styles.btnContainer}>
                <TouchableOpacity style={[styles.btn, searchMethodRef.current === props.search && { backgroundColor: "transparent" }]} onPress={() => subcategoryPress0(props.search, props.index)}>
                    <Text style={[styles.btnText, searchMethodRef.current !== props.search && { color: "#0c0000" }]}>{props.name}</Text>
                </TouchableOpacity>
            </View>
        )
    }



    // Header pour la flatlist verticale s'il s'agit d'une recherche

    const headerVerticalFlatlist = () => {
        if (props.category === "searches") {
            return (<>
                <Text style={styles.title2}>Résultats pour votre recherche « {props.searchedText} » :</Text>
                <View style={styles.line2}>
                </View>
            </>)
        }
    }







    // Composant pour rafraichir la page

    const [isRefreshing, setIsRefreshing] = useState(false)

    const refreshComponent = <RefreshControl refreshing={isRefreshing} colors={["#0c0000"]} progressBackgroundColor={"#fffcfc"} tintColor={"#0c0000"} onRefresh={() => {
        setIsRefreshing(true)
        setTimeout(() => setIsRefreshing(false), 1000)
        loadArticles()
    }} />






    // Affichage conditionnel si page bookmarks et pas connecté

    if (!user.jwtToken && props.category === "bookmarks") {
        return (
            <View style={styles.body2} >
                <Text style={styles.title}>Aucun article enregistré.</Text>
                <View style={styles.line}>
                </View>
                <Text style={styles.title}>Connectez-vous ou inscrivez-vous pour pouvoir enregistrer des articles en favoris.</Text>
            </View>
        )
    }




    // Affichage conditionnel si page bookmarks et pas de favoris


    if (user.jwtToken && allConcernedArticles.length === 0 && props.category === "bookmarks") {
        return (
            <View style={styles.body2} >
                <Text style={styles.title}>Aucun article enregistré.</Text>
                <View style={styles.line}>
                </View>
                <Text style={styles.title}>Cliquez sur un article pour l'afficher et pouvoir l'enregistrer !</Text>
            </View>
        )
    }




    return (
        <View style={styles.body} >
            <StatusBar translucent={true} barStyle="light" />

            {props.category === "searches" &&
                <FlatList
                    data={flatlist0Data}
                    ref={horizontalFlatlist0Ref}
                    horizontal={true}
                    ListHeaderComponent={headerFlatlist0}
                    showsHorizontalScrollIndicator={false}
                    style={styles.flatlist0}
                    renderItem={({ item, index }) => {
                        return <SubcategoryItem0 {...item} index={index} />
                    }}
                    contentContainerStyle={{ alignItems: 'center', paddingLeft: RPW(2) }}
                />}


            {!isThereOnlyOneCategoryBookmarked() && <FlatList
                data={subcategoriesList}
                ref={horizontalFlatlistRef}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={[styles.flatlist, subcategoriesList2 && { borderBottomWidth: 0 }, !subcategoriesList && { display: "none" },]}
                renderItem={({ item, index }) => {
                    return <SubcategoryItem {...item} index={index} />
                }}
                contentContainerStyle={{ alignItems: 'center', paddingLeft: RPW(2) }}
            />}


            {/* Bookmarks, deuxième liste de sous catégories */}
            <FlatList
                data={subcategoriesList2}
                ref={horizontalFlatlist2Ref}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={[styles.flatlist2, !subcategoriesList2 && { display: "none" }, isThereOnlyOneCategoryBookmarked() && { marginTop: RPW(2) }]}
                renderItem={({ item, index }) => {
                    return <SubcategoryItem2 {...item} index={index} />
                }}
                contentContainerStyle={{ alignItems: 'center', paddingLeft: RPW(2), paddingBottom: RPW(1) }}
            />




            <FlatList
                data={articlesToDisplay}
                refreshControl={refreshComponent}
                ref={verticalFlatlistRef}
                onScrollToIndexFailed={(event)=>{
                    verticalFlatlistRef.current.scrollToIndex({ animated :false, index : 0})
                }}
                initialNumToRender={(props.index && props.index !== "none" && testArticle.length == 0) ? Number(props.index)+5 : 10}
                onLayout={()=>{
                    if (props.index && props.index !== "none" && testArticle.length == 0){
                        setTimeout(()=>{
                            verticalFlatlistRef.current.scrollToIndex({
                                animated: true,
                                index : Number(props.index),
                            })
                        }, 1500)
                    }
                }}
                ListHeaderComponent={headerVerticalFlatlist}
                keyExtractor={(item, index) => item.test ? index : item._id}
                renderItem={({ item, index }) => {
                    if ((index === 0 || Number.isInteger((index) / 3)) && props.category !== "searches") {
                        return <TouchableOpacity onPress={() => articlePress(item._id, item.test, index)} ><TopArticle {...item} index={index} /></TouchableOpacity>
                    }
                    else {
                        return <TouchableOpacity onPress={() => articlePress(item._id, item.test, index)} ><Article {...item} /></TouchableOpacity>
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
    body2: {
        backgroundColor: "#fffcfc",
        flex: 1,
        alignItems: "center",
        paddingLeft: RPW(4),
        paddingRight: RPW(4),
        paddingTop: RPH(10),
    },
    title: {
        color: "#0c0000",
        fontSize: RPW(7.3),
        lineHeight: RPW(9),
        fontWeight: "450",
        marginBottom: 15,
        fontFamily: "Barlow-Bold",
        letterSpacing: RPW(-0.05),
        textAlign: "center"
    },
    line: {
        width: RPW(30),
        height: 3.5,
        marginBottom: RPH(4),
        marginTop: RPH(3.5),
        borderRadius: 15,
        backgroundColor: "rgb(185, 0, 0)",
    },
    title2: {
        color: "#0c0000",
        fontSize: RPW(7.6),
        lineHeight: RPW(8),
        fontWeight: "450",
        margin: RPW(4),
        marginTop: RPW(5),
        fontFamily: "Barlow-Bold",
        letterSpacing: RPW(-0.05),
        textAlign: "center"
    },
    line2: {
        width: RPW(25),
        height: 3.5,
        marginBottom: RPW(6),
        marginTop: RPW(0),
        alignSelf: "center",
        borderRadius: 15,
        backgroundColor: "rgb(185, 0, 0)",
    },
    btnContainer: {
        height: RPW(8.3),
        borderRadius: 8,
        marginRight: RPW(2.3),
        backgroundColor: "#0c0000",
    },
    btn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#dfdfdf",
        margin: 0,
        borderRadius: 8,
        paddingLeft: RPW(2),
        paddingRight: RPW(2),
    },
    btnContainer2: {
        height: RPW(8),
        borderBottomWidth: 2,
        marginRight: RPW(3.5),
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        color: "white",
        fontSize: RPW(4),
        fontWeight: "500",
    },
    btnText2: {
        color: "#0c0000",
        fontSize: RPW(4.3),
        fontWeight: "700",
    },
    flatlist0: {
        minHeight: RPW(11),
        maxHeight: RPW(11),
        minWidth: RPW(100),
    },
    flatlist: {
        minHeight: RPW(11.5),
        maxHeight: RPW(11.5),
        minWidth: RPW(100),
        borderBottomColor: "#878787",
        borderBottomWidth: 0.5
    },
    flatlist2: {
        minHeight: RPW(9.5),
        maxHeight: RPW(9.5),
        minWidth: RPW(100),
        borderBottomColor: "#878787",
        borderBottomWidth: 0.5
    }
})