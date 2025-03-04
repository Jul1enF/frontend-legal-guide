
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from 'react-native'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../../../reducers/user'
import { addRequest } from '../../../../reducers/emergencies';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { RPH, RPW } from "../../../../modules/dimensions"

// import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';



const url = process.env.EXPO_PUBLIC_BACK_ADDRESS

export default function Signin() {

    const dispatch = useDispatch()

    // États pour erreur, inputs, visibilité mots de passe et offset du KeyboardAvoidingView

    const [error, setError] = useState('')

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [passwordVisible, setPasswordVisible] = useState(false)




    // Fonction appelée au click sur se connecter

    const connectRef = useRef(true)

    const connectClick = async () => {
        Keyboard.dismiss()

        if (!email || !password) {
            setError("Merci de remplir tous les champs ci dessous !")
        }
        else {
            if (!connectRef.current) { return }
            connectRef.current = false

            const response = await fetch(`${url}/users/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                })
            })
            const data = await response.json()

            if (!data.result) {
                setError(data.error)
                connectRef.current = true
            }
            else {
                dispatch(login({
                    firstname: data.firstname,
                    name: data.name,
                    email: data.email,
                    jwtToken: data.jwtToken,
                    is_admin: data.is_admin,
                    phone : data.phone,
                    push_token: data.push_token,
                    bookmarks: data.bookmarks,
                }))

                connectRef.current = true

                router.push("/")
            }
        }
    }




    // Sticky Header pour revenir à connection

    function StickyHeader() {
        return (
            <View style={styles.header} >
                <TouchableOpacity style={styles.headerSection} onPress={() => router.back(`/connection`)}>
                    <FontAwesome5 name="chevron-left" color="white" size={RPW(4.2)} style={styles.icon} />
                    <Text style={styles.headerText}>Connection</Text>
                </TouchableOpacity>
            </View>
        )
    }






    return (<>

        {/* <KeyboardAwareScrollView
                       style={{ flex: 1, backgroundColor: "#fffcfc" }}
                       contentContainerStyle={{ alignItems: "center", paddingBottom: RPH(2) }}
                       scrollEnabled={scrollable}
                       bottomOffset={Platform.OS === 'ios' ? RPH(7) : RPH(2)}
                       stickyHeaderIndices={[0]}
                   > */}

        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.body} keyboardVerticalOffset={RPH(12)}  >
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ alignItems: "center", paddingBottom: RPH(2) }}
                keyboardShouldPersistTaps="handled"
                stickyHeaderIndices={[0]}>


                <StickyHeader />


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

                <View style={styles.inputContainer} >
                    <TextInput style={styles.password}
                        onChangeText={(e) => {
                            setPassword(e)
                            setError('')
                        }}
                        value={password}
                        autoCapitalize='none'
                        placeholder='Mot de passe'
                        placeholderTextColor="#fbfff790"
                        secureTextEntry={!passwordVisible}>
                    </TextInput>
                    <FontAwesome
                        name={passwordVisible ? "eye-slash" : "eye"} color="rgba(255,255,255,0.4)" size={RPH(3.8)} onPress={() => setPasswordVisible(!passwordVisible)}>
                    </FontAwesome>
                </View>


                <TouchableOpacity style={styles.registerBtn} onPress={() => connectClick()}>
                    <Text style={styles.registerSentence}>
                        Se connecter
                    </Text>
                </TouchableOpacity>

                <Text style={styles.error}>{error}</Text>


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
    header: {
        height: RPW(10),
        width: RPW(100),
        paddingLeft: RPW(4),
        paddingRight: RPW(4),
        marginBottom : RPH(18),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#0c0000",
    },
    headerSection: {
        width: RPW(50),
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    icon: {
        marginRight: RPW(3)
    },
    headerText: {
        color: "white",
        fontWeight: "500",
        fontSize: RPW(4.5),
        letterSpacing : RPW(0.1)
    },
    inputContainer: {
        marginBottom: RPH(4),
        width: "90%",
        height: RPH(6),
        maxHeight : 44,
        borderRadius: RPH(1),
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
        fontSize: 20
    },
    password: {
        width: "85%",
        height: "100%",
        paddingLeft: RPW(4),
        color: "white",
        fontSize: 20
    },
    registerBtn: {
        width: "90%",
        height: RPH(6),
        maxHeight : 46,
        borderRadius: RPH(1),
        marginTop: RPH(7),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0c0000",
    },
    registerSentence: {
        color: "#fffcfc",
        fontSize: 24,
    },
    error: {
        color: "red",
        fontSize: RPW(4),
        fontWeight: "600",
        marginTop: RPH(2)
    }
})
