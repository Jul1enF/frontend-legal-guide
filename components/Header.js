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

    useEffect(() => {
        if (pathName.includes('-article') || pathName.includes('notification-page')) {
            setArticlePage(true)
        }
        else {
            setArticlePage(false)
        }
    }, [pathName])



    // États pour l'affichage et l'enregistrement de la recherche

    const [searchVisible, setSearchVisible] = useState(false)
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
        setSearchVisible(false)
    }


    // Affichage conditionnel de la page paramètres ou d'un renvoie vers la page de connexion

    let informationsOrConnexion

    if (user.jwtToken) {
        informationsOrConnexion = <TouchableOpacity style={styles.linkContainer} activeOpacity={0.6} onPress={() => {
            setMenuVisible(false)
            router.navigate('/settings')
        }}>
            <Text style={styles.link}>Settings</Text>
        </TouchableOpacity>
    }
    else {
        informationsOrConnexion = <TouchableOpacity style={styles.linkContainer} activeOpacity={0.6} onPress={() => {
            setMenuVisible(false)
            router.navigate('/')
        }}>
            <Text style={styles.link}>Se connecter / S'inscrire</Text>
        </TouchableOpacity>
    }


    return (
        <View style={styles.body}>
            <StatusBar translucent={true} backgroundColor="transparent" barStyle="light" />
            <LinearGradient style={styles.header}
                colors={["#0c0000", "#0c0000"]}
                locations={[0.15, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
            >
                <View style={styles.menuIconContainer}>
                    <FontAwesome name="navicon" style={styles.icon} size={RPW(5.3)} onPress={() => setMenuVisible(!menuVisible)} />
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        Me Baudelin
                    </Text>
                </View>
                <View style={styles.searchIconContainer}>
                    <Icon name="alarm-light-outline" style={styles.icon} size={RPW(6)} onPress={() => setSearchVisible(!searchVisible)} />
                </View>
            </LinearGradient>
            <View style={styles.headerLigne}></View>


            <Modal
                isVisible={searchVisible}
                style={styles.modal}
                backdropColor="transparent"
                animationIn="fadeInDown"
                animationOut="fadeOutUp"
                onBackButtonPress={() => setSearchVisible(!searchVisible)}
                onBackdropPress={() => setSearchVisible(!searchVisible)}
            >
                <LinearGradient style={styles.searchContainer}
                    colors={["rgb(185, 0, 0)", "rgb(185, 0, 0)"]}
                    locations={[0.15, 1]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                >
                    <View style={styles.searchInputContainer}>
                        <TextInput
                            style={styles.search}
                            placeholder="Rechercher..."
                            onChangeText={(e) => setSearchText(e)}
                            value={searchText}
                            returnKeyType="send"
                            placeholderTextColor={"rgba(255,255,255,0.85)"}
                            autoCapitalize="none"
                            autoCorrect={false}
                            onSubmitEditing={() => submitSearch()}
                        ></TextInput>
                        <FontAwesome6 name="magnifying-glass" style={styles.icon} size={RPH(1.9)} onPress={() => submitSearch()} />
                    </View>
                    <FontAwesome6 name="chevron-up" style={styles.icon} size={RPH(2.8)} onPress={() => setSearchVisible(!searchVisible)} />

                </LinearGradient>
            </Modal>


            <Modal
                isVisible={menuVisible}
                style={styles.modal}
                backdropColor="transparent"
                animationIn="slideInLeft"
                animationOut="slideOutLeft"
                onBackButtonPress={() => setMenuVisible(!menuVisible)}
                onBackdropPress={() => setMenuVisible(!menuVisible)}
            >
                <View style={!articlePage ? styles.modalBody : styles.modalBody2}>
                    {/* <TouchableOpacity style={styles.linkContainer} activeOpacity={0.6} onPress={() => {
                        setMenuVisible(false)
                        router.navigate('/home')
                    }}>
                        <Text style={styles.link}>Accueil</Text>
                    </TouchableOpacity> */}
                    {informationsOrConnexion}
                    
                        <TouchableOpacity activeOpacity={0.6} style={styles.linkContainer} onPress={() => {
                            setMenuVisible(false)
                            router.push('/redaction')
                        }}>
                            <Text style={styles.link}>Écrire / Modifier un article</Text>
                        </TouchableOpacity>
                    
                    {/* {user.is_admin &&
                        <TouchableOpacity activeOpacity={0.6} style={styles.linkContainer} onPress={() => {
                            setMenuVisible(false)
                            router.push('/notifications')
                        }}>
                            <Text style={styles.link}>Notifications</Text>
                        </TouchableOpacity>
                    } */}
                    {user.jwtToken && <TouchableOpacity activeOpacity={0.6} style={styles.linkContainer} onPress={() => logoutPress()}>
                        <Text style={styles.link}>Se déconnecter</Text>
                    </TouchableOpacity>}
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
        paddingTop: RPH(5.5) - (statusHeight / 2),
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
    menuIconContainer: {
        width: "15%",
        height: "100%",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingLeft: RPW(4),
    },
    titleContainer: {
        width: "70%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: RPW(9.3),
        color: "white",
        letterSpacing: RPW(0.6),
        fontWeight: "600",
        fontFamily : "Barlow-SemiBold",
        lineHeight : RPW(9.3)
    },
    searchIconContainer: {
        width: "15%",
        height: "100%",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingRight: RPW(4),
    },
    icon: {
        color: "white",
    },
    headerLigne: {
        borderBottomColor: "#878787",
        borderBottomWidth: RPH(0.2)
    },
    searchContainer: {
        position: "absolute",
        top: RPH(13) - statusHeight,
        height: RPW(12.5),
        width: RPW(100),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: RPW(4),
        paddingRight: RPW(4),
    },
    searchInputContainer: {
        borderBottomColor: "white",
        borderBottomWidth: 0.5,
        width: RPW(50),
        paddingBottom: RPH(1),
        paddingRight: RPW(1),
        marginTop: RPH(0.5),
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
    },
    search: {
        color: "white",
        fontSize: RPH(2.3),
        fontWeight: "500",
        width: "90%",
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
        top: RPH(12.9) - statusHeight,
    },
    modalBody2: {
        height: RPH(77.6)- RPW(10),
        width: RPW(80),
        backgroundColor: "#e3e3e3",
        position: "absolute",
        top: RPH(12.9) + RPW(10) - statusHeight,
    },
    linkContainer: {
        height: RPH(11.5),
        borderTopWidth: 0.5,
        borderTopColor: "#19290a",
        justifyContent: "center",
        alignItems: "center",
    },
    link: {
        color: "#19290a",
        fontSize: RPW(6.3),
        fontWeight: "300"
    },
})