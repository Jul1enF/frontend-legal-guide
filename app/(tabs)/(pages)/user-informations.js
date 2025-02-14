
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Modal } from 'react-native'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeUserInfos, logout } from '../../../reducers/user'
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { RPH, RPW } from "../../../modules/dimensions"

// import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';




export default function Signup() {


    const user = useSelector((state) => state.user.value)
    const dispatch = useDispatch()

    // UseEffect pour charger dans les états les valeurs des informations du user

    useEffect(() => {
        setFirstname(user.firstname)
        setName(user.name)
        setEmail(user.email)
        setPhone(user.phone)
        setOldPassword("")
        setPassword('')
        setPassword2('')
    }, [user])


    const [firstname, setFirstname] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')

    const [error, setError] = useState('')

    const [modal1Visible, setModal1Visible] = useState(false)
    const [modal2Visible, setModal2Visible] = useState(false)

    const [oldPasswordVisible, setOldPasswordVisible] = useState(false)
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [password2Visible, setPassword2Visible] = useState(false)


    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS


    // Fonction appelée en cliquant pour la première fois sur enregistrer

    const firstRegisterPress = () => {

        const regexMail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g


        if (!firstname || !name || !email) {
            setError("Merci de ne pas laisser les trois premiers champs vides !")
        }
        else if (oldPassword && !password || password && !oldPassword) {
            setError("Merci de bien remplir l'ancien et le nouveau mot de passe !")
        }
        else if (password !== password2) {
            setError("Erreur de confirmation du mot de passe !")
        }
        else if (!regexMail.test(email)) {
            setError("Adresse mail non valide !")
        }
        else {
            setModal1Visible(true)
        }
    }




    // Fonction appelée en cliquant sur enregistrer pour la deuxième fois

    const registerRef = useRef(true)

    const finalRegisterPress = async () => {
        if (registerRef.current == false) { return }
        registerRef.current = false


        const response = await fetch(`${url}/userModifications/modify-user`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                firstname,
                email,
                oldPassword,
                password,
                phone,
                jwtToken: user.jwtToken,
            })
        })
        const data = await response.json()

        if (data.result) {
            setModal1Visible(false)
            dispatch(changeUserInfos({
                name,
                firstname,
                email,
                phone,
            }))

            setOldPassword("")
            setPassword('')
            setPassword2('')

            registerRef.current = true

            setError("Modifications enregistrées !")
            setTimeout(() => setError(''), 4000)
        }
        else if (data.error) {
            setModal1Visible(false)

            registerRef.current = true

            setError(data.error)
            setTimeout(() => setError(''), 5000)
        }
        else {
            setModal1Visible(false)

            registerRef.current = true

            setError("Problème d'autorisation. Essayez en quittant l'application et en vous reconnectant.")
            setTimeout(() => setError(''), 5000)
        }
    }




    // Fonction appelée en se désincrivant
    const unsuscribeRef = useRef(true)


    const unsuscribePress = async () => {
        if (unsuscribeRef.current = false) { return }
        unsuscribeRef.current = false

        const response = await fetch(`${url}/userModifications/delete-user/${user.jwtToken}`, { method: 'DELETE' })

        const data = await response.json()

        if (!data.result && data.error) {
            setError(data.error)
            setTimeout(() => setError(''), 4000)
            unsuscribeRef.current = true
        }
        else if (!data.result) {
            setError("Erreur : Merci de réessayez après vous être reconnecté ou de contacter l'Éditeur de l'application.")
            setTimeout(() => setError(''), 4000)
            unsuscribeRef.current = true
        }
        else {
            setModal2Visible(false)
            dispatch(logout())
            router.push(`/`)
            unsuscribeRef.current = true
        }

    }




    return (<>

        {/* <KeyboardAwareScrollView
                       style={{ flex: 1, backgroundColor: "#f9fff4" }}
                       contentContainerStyle={{ alignItems: "center", paddingBottom: RPH(2), paddingTop: RPW(10) }}
                       scrollEnabled={scrollable}
                       bottomOffset={Platform.OS === 'ios' ? RPH(7) : RPH(2)}
                   > */}

        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.body} keyboardVerticalOffset={RPH(14)}  >
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ alignItems: "center", paddingBottom: RPH(2), paddingTop: RPW(10) }}
                keyboardShouldPersistTaps="handled">



                <Text style={styles.title}>Mes informations</Text>
                <View style={styles.titleLine}></View>


                <Text style={styles.text1}>
                    Changer mon prénom :
                </Text>
                <View style={styles.inputContainer} >
                    <TextInput style={styles.input}
                        onChangeText={(e) => {
                            setFirstname(e)
                            setError('')
                        }}
                        value={firstname}
                        placeholder='Prénom'
                        placeholderTextColor="#fbfff790">
                    </TextInput>
                </View>

                <Text style={styles.text1}>
                    Changer mon nom :
                </Text>
                <View style={styles.inputContainer} >
                    <TextInput style={styles.input}
                        onChangeText={(e) => {
                            setName(e)
                            setError('')
                        }}
                        value={name}
                        placeholder='Nom'
                        placeholderTextColor="#fbfff790">
                    </TextInput>
                </View>

                <Text style={styles.text1}>
                    Changer mon email :
                </Text>
                <View style={styles.inputContainer} >
                    <TextInput style={styles.input}
                        onChangeText={(e) => {
                            setEmail(e)
                            setError('')
                        }}
                        value={email}
                        placeholder='Email'
                        placeholderTextColor="#fbfff790"
                        keyboardType='email-address'
                        autoCapitalize='none'>
                    </TextInput>
                </View>

                <Text style={styles.text1}>
                    Changer mon téléphone :
                </Text>
                <View style={styles.inputContainer} >
                    <TextInput style={styles.input}
                        onChangeText={(e) => {
                            setPhone(e)
                            setError('')
                        }}
                        value={phone}
                        placeholder="Téléphone (facultatif)"
                        placeholderTextColor="#fbfff790"
                    >
                    </TextInput>
                </View>

                <Text style={styles.text1}>
                    Changer mon mot de passe :
                </Text>
                <View style={styles.inputContainer} >
                    <TextInput style={styles.password}
                        onChangeText={(e) => {
                            setOldPassword(e)
                            setError('')
                        }}
                        value={oldPassword}
                        autoCapitalize='none'
                        placeholder='Ancien mot de passe'
                        placeholderTextColor="#fbfff790"
                        secureTextEntry={!oldPasswordVisible}>
                    </TextInput>
                    <FontAwesome
                        name={oldPasswordVisible ? "eye-slash" : "eye"} color="rgba(255,255,255,0.4)" size={RPH(3.8)} onPress={() => setOldPasswordVisible(!oldPasswordVisible)}>
                    </FontAwesome>
                </View>

                <View style={styles.inputContainer} >
                    <TextInput style={styles.password}
                        onChangeText={(e) => {
                            setPassword(e)
                            setError('')
                        }}
                        value={password}
                        autoCapitalize='none'
                        placeholder='Nouveau mot de passe'
                        placeholderTextColor="#fbfff790"
                        secureTextEntry={!passwordVisible}>
                    </TextInput>
                    <FontAwesome
                        name={passwordVisible ? "eye-slash" : "eye"} color="rgba(255,255,255,0.4)" size={RPH(3.8)} onPress={() => setPasswordVisible(!passwordVisible)}>
                    </FontAwesome>
                </View>

                <View style={styles.inputContainer} >
                    <TextInput style={styles.password}
                        onChangeText={(e) => {
                            setPassword2(e)
                            setError('')
                        }}
                        value={password2}
                        autoCapitalize='none'
                        placeholder='Confirmation du mot de passe'
                        placeholderTextColor="#fbfff790"
                        secureTextEntry={!password2Visible}>
                    </TextInput>
                    <FontAwesome
                        name={password2Visible ? "eye-slash" : "eye"} color="rgba(255,255,255,0.4)" size={RPH(3.8)} onPress={() => setPassword2Visible(!password2Visible)}>
                    </FontAwesome>
                </View>



                <Text style={[styles.error, error == "Modifications enregistrées !" && { color: "green" } ]}>{error}</Text>


                <View style={styles.row}>

                    <TouchableOpacity style={styles.btn} onPress={() => firstRegisterPress()}>
                        <Text style={styles.btnSentence}>
                            Enregistrer
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btn} onPress={() => setModal2Visible(true)}>
                        <Text style={styles.btnSentence}>
                            Me désinscrire
                        </Text>
                    </TouchableOpacity>

                </View>


                <Modal
                    visible={modal1Visible}
                    animationType="slide"
                    style={styles.modal}
                    backdropColor="rgba(0,0,0,0.9)"
                    transparent={true}
                    onRequestClose={() => setModal1Visible(!modal1Visible)}
                >
                    <View style={styles.modalBody}>
                        <Text style={styles.modalText}>Êtes vous sûr de vouloir enregistrer ces informations ?</Text>
                        <View style={styles.line}>
                        </View>
                        <View style={styles.btnContainer4}>
                            <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.8} onPress={() => setModal1Visible(false)}>
                                <Text style={styles.modalText2}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.8} onPress={() => finalRegisterPress()}>
                                <Text style={styles.modalText2}>Enregistrer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>


                <Modal
                    visible={modal2Visible}
                    animationType="slide"
                    style={styles.modal}
                    backdropColor="rgba(0,0,0,0.9)"
                    transparent={true}
                    onRequestClose={() => setModal2Visible(!modal2Visible)}
                >
                    <View style={styles.modalBody}>
                        <Text style={styles.modalText}>Êtes vous sûr de vouloir supprimer votre compte ?</Text>
                        <View style={styles.line}>
                        </View>
                        <View style={styles.btnContainer4}>
                            <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.8} onPress={() => setModal2Visible(false)}>
                                <Text style={styles.modalText2}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.8} onPress={() => unsuscribePress()}>
                                <Text style={styles.modalText2}>Confirmer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>


            </ScrollView>
        </KeyboardAvoidingView>

        {/* </KeyboardAwareScrollView> */}

    </>
    )

}

const styles = StyleSheet.create({
    body: {
        backgroundColor: "#fffcfc",
        flex: 1,
    },
    title: {
        color: "#2a0000",
        fontSize: RPW(8),
        marginBottom: 15,
        fontFamily: "Barlow-Bold",
        letterSpacing: RPW(0),
    },
    titleLine: {
        width: "30%",
        height: 3.5,
        marginBottom: RPW(8),
        marginLeft: RPW(1),
        borderRadius: 15,
        backgroundColor: "rgb(185, 0, 0)",
    },
    inputContainer: {
        marginBottom: RPW(7),
        width: "90%",
        height: RPW(10.5),
        borderRadius: RPW(2),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: RPW(4),
        backgroundColor: "rgb(157, 0, 0)",
    },
    input: {
        flex: 1,
        paddingLeft: RPW(4),
        color: "white",
        fontSize: RPW(5)
    },
    text1: {
        fontFamily: "Barlow-SemiBold",
        color: "#0c0000",
        fontSize: RPW(6),
        fontWeight: "600",
        marginBottom: 13,
        marginTop: RPW(1)
    },
    password: {
        width: "85%",
        height: "100%",
        paddingLeft: RPW(4),
        color: "white",
        fontSize: RPW(5)
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: RPW(100),
    },
    btn: {
        width: RPW(42),
        height: RPW(12),
        borderRadius: RPW(2),
        marginTop: RPW(3),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0c0000",
    },
    btnSentence: {
        color: "#fffcfc",
        fontSize: RPW(5),
        fontWeight: "600"
    },
    error: {
        color: "red",
        fontSize: RPW(4.5),
        fontWeight: "600",
        marginTop: RPH(1)
    },
    modal: {
        alignItems: "center"
    },
    modalBody: {
        height: RPH(35),
        width: RPW(94),
        borderRadius: 10,
        paddingTop: RPH(5),
        paddingBottom: RPH(5),
        paddingLeft: RPW(2),
        paddingRight: RPW(2),
        backgroundColor: "#dfdfdf",
        position: "absolute",
        bottom: RPH(17),
        left: RPW(3),
        justifyContent: "space-between",
        alignItems: "center"
    },
    modalText: {
        color: "#0c0000",
        fontSize: RPW(5.7),
        fontWeight: "600",
        textAlign: "center",
        paddingLeft: RPW(5),
        paddingRight: RPW(5),
        lineHeight: RPH(4)
    },
    line: {
        width: "90%",
        height: 4,
        marginTop: -6,
        backgroundColor: "rgb(157, 0, 0)",
    },
    btnContainer4: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "100%"
    },
    btnTouchable: {
        width: RPW(37),
        height: RPW(13),
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0c0000",
    },
    modalText2: {
        color: "white",
        fontSize: RPW(5.2),
        fontWeight: "700",
        marginRight: RPW(2),
    },
})
