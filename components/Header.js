import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import Modal from "react-native-modal"

import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../reducers/user";
import { router, usePathname } from "expo-router";
import { RPH, RPW } from "../modules/dimensions"


const statusHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0

export default function Header() {

    const [menuVisible, setMenuVisible] = useState(false)
    const user = useSelector((state) => state.user.value)
    const dispatch = useDispatch()
    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS


    // useEffect et variables pour ajuster la taille de la modal si l'on est sur une page avec un second header
    const [articlePage, setArticlePage] = useState(false)
    const pathName = usePathname()

    const pagePath = pathName === '/' ? "index" : pathName


    useEffect(() => {
        if (pathName.includes('-article')) {
            setArticlePage(true)
        }
        else {
            setArticlePage(false)
        }
    }, [pathName])



    // États pour l'affichage et l'enregistrement de la recherche

    const [searchText, setSearchText] = useState('')


    // Fonction appelée en cliquant sur Se déconnecter

    const logoutPress = async () => {

        // Reducer logout, fermeture du menu et push vers page d'accueil
        setMenuVisible(false)
        dispatch(logout())
        router.navigate('/')
    }



    // Fonction appelée en soumettant une recherche

    const submitSearch = () => {
        router.push(`/searches/${searchText}`)
        setSearchText('')
        setMenuVisible(false)
    }


    // Affichage conditionnel de la page paramètres ou d'un renvoie vers la page de connexion

    let logoutOrConnection

    if (user.jwtToken) {
        logoutOrConnection = <TouchableOpacity style={styles.linkContainer} activeOpacity={0.6} onPress={() => {
            logoutPress()
        }}>
            <Text style={styles.link}>Se déconnecter</Text>
        </TouchableOpacity>
    }
    else {
        logoutOrConnection = <TouchableOpacity style={styles.linkContainer} activeOpacity={0.6} onPress={() => {
            setMenuVisible(false)
            router.push('/connection')
        }}>
            <Text style={styles.link}>Se connecter / S'inscrire</Text>
        </TouchableOpacity>
    }






    return (
        <View style={styles.body}>
            <StatusBar translucent={true} backgroundColor="transparent" barStyle="light" />
            <View style={styles.header}>
                <TouchableOpacity style={styles.menuIconContainer} onPress={() => setMenuVisible(!menuVisible)}>
                    <FontAwesome name="navicon" style={styles.icon} size={RPW(5.3)} />
                    <Text style={styles.iconText}>Menu</Text>
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        Me Baudelin
                    </Text>
                </View>
                <TouchableOpacity style={styles.emergencyIconContainer} onPress={() => router.push(`/emergency-request/${pagePath}`)}>
                    <Icon name="alarm-light-outline" style={styles.icon} size={RPW(6.2)} />
                    <Text style={styles.iconText}>Urgence</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.headerLigne}></View>



            <Modal
                isVisible={menuVisible}
                style={styles.modal}
                backdropColor="transparent"
                animationIn="slideInLeft"
                animationOut="slideOutLeft"
                onBackButtonPress={() => setMenuVisible(!menuVisible)}
                onBackdropPress={() => setMenuVisible(!menuVisible)}
            >
                <View style={styles.modalBody}>

                    <View style={styles.searchContainer}>
                        <View style={styles.inputAndIconContainer}>
                            <TextInput
                                style={styles.search}
                                placeholder="Rechercher..."
                                onChangeText={(e) => setSearchText(e)}
                                value={searchText}
                                returnKeyType="send"
                                placeholderTextColor={"rgba(63, 63, 63, 0.6)"}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onSubmitEditing={() => submitSearch()}
                            ></TextInput>
                            <FontAwesome6 name="magnifying-glass" style={styles.icon2} size={RPW(5)} onPress={() => submitSearch()} />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.linkContainer} activeOpacity={0.6} onPress={() => {
                        setMenuVisible(false)
                        router.push('/')
                    }}>
                        <Text style={styles.link}>Accueil</Text>
                    </TouchableOpacity>

                    {user.jwtToken && <TouchableOpacity style={styles.linkContainer} activeOpacity={0.6} onPress={() => {
                        setMenuVisible(false)
                        router.push('/user-informations')
                    }}>
                        <Text style={styles.link}>Mes informations</Text>
                    </TouchableOpacity>}

                    {logoutOrConnection}

                    {user.is_admin && <TouchableOpacity activeOpacity={0.6} style={styles.linkContainer} onPress={() => {
                        setMenuVisible(false)
                        router.push('/redaction')
                    }}>
                        <Text style={styles.link}>Écrire / Modifier un article</Text>
                    </TouchableOpacity>}

                    {user.is_admin &&
                        <TouchableOpacity activeOpacity={0.6} style={styles.linkContainer} onPress={() => {
                            setMenuVisible(false)
                            router.push('/emergencies-list')
                        }}>
                            <Text style={styles.link}>Liste des contacts urgents</Text>
                        </TouchableOpacity>
                    }
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        height: RPH(13),
        width: RPW(100),
    },
    header: {
        flex: 1,
        paddingTop: RPH(5.5),
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "#0c0000",
    },
    menuIconContainer: {
        width: "20%",
        height: "100%",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingLeft: RPW(0),
    },
    iconText: {
        fontSize: RPW(4.2),
        color: "#fffcfc",
        letterSpacing: RPW(0.1),
        fontFamily: "Barlow-Regular",
        lineHeight: RPW(5),
        marginTop: RPW(1),
        marginBottom: RPW(1.5)
    },
    titleContainer: {
        width: "60%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: RPW(9.3),
        color: "#fffcfc",
        letterSpacing: RPW(0.6),
        fontFamily: "Barlow-SemiBold",
        lineHeight: RPW(9.3)
    },
    emergencyIconContainer: {
        width: "20%",
        height: "100%",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingRight: RPW(0),
    },
    icon: {
        color: "#fffcfc",
    },
    headerLigne: {
        borderBottomColor: "#878787",
        borderBottomWidth: RPH(0.2)
    },
    modal: {
        alignItems: "flex-start",
        justifyContent: "flex-start",
        margin: 0,
    },
    modalBody: {
        height: RPH(77.6),
        width: RPW(80),
        backgroundColor: "#e3e3e3",
        position: "absolute",
        zIndex : 10,
        top: RPH(12.9) - statusHeight,
    },
    linkContainer: {
        height: RPH(11.5),
        borderTopWidth: 0.5,
        borderTopColor: "#0c0000",
        justifyContent: "center",
        alignItems: "center",
    },
    link: {
        color: "#0c0000",
        fontSize: RPW(7.8),
        letterSpacing: RPW(0.1),
        fontFamily: "Barlow-Light",
    },
    searchContainer : {
        height: RPH(13),
        width : "100%",
        paddingLeft: RPW(3),
        paddingRight: RPW(3),
        justifyContent : "center",
    },
    inputAndIconContainer: {
        height :RPH(8),
        backgroundColor: "rgb(250, 248, 248)",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius : RPW(3),
        paddingLeft : RPW(5),
        paddingRight : RPW(3)
    },
    search: {
        color: "#0c0000",
        fontSize: RPW(7.8),
        letterSpacing: RPW(0.2),
        fontFamily: "Barlow-Light",
        width: "85%",
    },
    icon2: {
        color: "rgba(63, 63, 63, 0.44)",
        marginRight: RPW(3),
        marginTop: RPH(0.2)
    },
})